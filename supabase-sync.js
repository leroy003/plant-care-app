/**
 * Supabase 跨设备同步模块
 * 
 * 数据模型：
 *   user_plant_data 表：
 *     - username (text, primary key)
 *     - zone_plants (jsonb)     — [{name, zone}, ...]
 *     - bought_names (jsonb)    — ["植物名1", "植物名2", ...]
 *     - updated_at (timestamptz)
 * 
 * 使用方式：
 *   1. 用户输入用户名 → syncManager.setUsername(name)
 *   2. 操作植物后调用 → syncManager.pushToCloud()
 *   3. 需要拉取时调用 → syncManager.pullFromCloud()
 *   4. 自动定时同步   → 内置 30 秒轮询
 */

// ============================================================
// Supabase 配置（需替换为真实值）
// ============================================================
var SUPABASE_URL = 'https://buzykoirfunaydxlutpa.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1enlrb2lyZnVuYXlkeGx1dHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTk3NDcsImV4cCI6MjA4ODc5NTc0N30.j2qKsZlv8kCXh6ijBI5PZZui74awyYFmrWiQjsIvPXA';

// ============================================================
// 同步管理器
// ============================================================
var syncManager = (function () {

  // ----- 内部状态 -----
  var _username = localStorage.getItem('sync_username') || '';
  var _syncing = false;
  var _lastSyncTime = null;
  var _syncTimer = null;
  var _initialized = false;
  var _statusCallback = null;   // UI 状态回调
  var _dataChangeCallback = null; // 数据变更回调（拉取后刷新界面）

  // Supabase REST 请求封装
  function supabaseRequest(method, path, body) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return Promise.reject(new Error('Supabase 未配置'));
    }
    var url = SUPABASE_URL + '/rest/v1/' + path;
    var headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'resolution=merge-duplicates,return=representation' : 'return=representation'
    };
    var opts = { method: method, headers: headers };
    if (body) opts.body = JSON.stringify(body);
    return fetch(url, opts).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error('Supabase 请求失败 (' + res.status + '): ' + t);
        });
      }
      var ct = res.headers.get('content-type') || '';
      if (ct.indexOf('json') !== -1) return res.json();
      return null;
    });
  }

  // ----- 工具函数 -----

  // 获取本地区域植物（简化格式）
  function getLocalZonePlants() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_ZONE_PLANTS)) || [];
    } catch (e) { return []; }
  }

  // 获取本地已购名单
  function getLocalBoughtNames() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_BOUGHT)) || [];
    } catch (e) { return []; }
  }

  // 通知 UI 状态变化
  function emitStatus(status, message) {
    if (_statusCallback) {
      _statusCallback({ status: status, message: message, time: new Date() });
    }
  }

  // ----- 核心同步方法 -----

  /**
   * 上传本地数据到云端（upsert）
   */
  function pushToCloud() {
    if (!_username) {
      emitStatus('error', '请先设置用户名');
      return Promise.reject(new Error('未设置用户名'));
    }
    if (_syncing) {
      return Promise.resolve();
    }
    _syncing = true;
    emitStatus('syncing', '正在上传...');

    var zonePlants = getLocalZonePlants();
    var boughtNames = getLocalBoughtNames();

    var payload = {
      username: _username,
      zone_plants: zonePlants,
      bought_names: boughtNames,
      updated_at: new Date().toISOString()
    };

    return supabaseRequest('POST', 'user_plant_data?on_conflict=username', payload)
      .then(function (data) {
        _lastSyncTime = new Date();
        _syncing = false;
        emitStatus('success', '上传成功');
        return data;
      })
      .catch(function (err) {
        _syncing = false;
        emitStatus('error', '上传失败: ' + err.message);
        throw err;
      });
  }

  /**
   * 从云端拉取数据并覆盖本地
   * 返回 {zonePlants, boughtNames} 或 null（无云端数据）
   */
  function pullFromCloud() {
    if (!_username) {
      emitStatus('error', '请先设置用户名');
      return Promise.reject(new Error('未设置用户名'));
    }
    if (_syncing) {
      return Promise.resolve(null);
    }
    _syncing = true;
    emitStatus('syncing', '正在拉取...');

    var path = 'user_plant_data?username=eq.' + encodeURIComponent(_username) + '&select=*';
    return supabaseRequest('GET', path)
      .then(function (rows) {
        _syncing = false;
        if (!rows || rows.length === 0) {
          emitStatus('info', '云端暂无数据');
          return null;
        }
        var remote = rows[0];

        // 写入本地
        localStorage.setItem(STORAGE_KEY_ZONE_PLANTS, JSON.stringify(remote.zone_plants || []));
        localStorage.setItem(STORAGE_KEY_BOUGHT, JSON.stringify(remote.bought_names || []));

        _lastSyncTime = new Date();
        emitStatus('success', '拉取成功');

        // 通知外部刷新界面
        if (_dataChangeCallback) {
          _dataChangeCallback(remote.zone_plants, remote.bought_names);
        }

        return {
          zonePlants: remote.zone_plants,
          boughtNames: remote.bought_names
        };
      })
      .catch(function (err) {
        _syncing = false;
        emitStatus('error', '拉取失败: ' + err.message);
        throw err;
      });
  }

  /**
   * 智能同步：先拉取云端，与本地合并后再上传
   * 合并策略：取并集（以云端 zone 优先），已购取并集
   */
  function smartSync() {
    if (!_username) {
      emitStatus('error', '请先设置用户名');
      return Promise.reject(new Error('未设置用户名'));
    }
    if (_syncing) return Promise.resolve();
    _syncing = true;
    emitStatus('syncing', '正在同步...');

    var localZonePlants = getLocalZonePlants();
    var localBoughtNames = getLocalBoughtNames();

    var path = 'user_plant_data?username=eq.' + encodeURIComponent(_username) + '&select=*';
    return supabaseRequest('GET', path)
      .then(function (rows) {
        var remoteZonePlants = [];
        var remoteBoughtNames = [];

        if (rows && rows.length > 0) {
          remoteZonePlants = rows[0].zone_plants || [];
          remoteBoughtNames = rows[0].bought_names || [];
        }

        // 合并区域植物：以 name 为键，本地优先（用户最新操作）
        var mergedMap = {};
        remoteZonePlants.forEach(function (p) {
          mergedMap[p.name] = { name: p.name, zone: p.zone };
        });
        localZonePlants.forEach(function (p) {
          mergedMap[p.name] = { name: p.name, zone: p.zone };
        });
        var mergedZonePlants = Object.keys(mergedMap).map(function (k) { return mergedMap[k]; });

        // 合并已购：取并集
        var boughtSet = {};
        remoteBoughtNames.forEach(function (n) { boughtSet[n] = true; });
        localBoughtNames.forEach(function (n) { boughtSet[n] = true; });
        var mergedBoughtNames = Object.keys(boughtSet);

        // 保存到本地
        localStorage.setItem(STORAGE_KEY_ZONE_PLANTS, JSON.stringify(mergedZonePlants));
        localStorage.setItem(STORAGE_KEY_BOUGHT, JSON.stringify(mergedBoughtNames));

        // 上传合并后的数据
        var payload = {
          username: _username,
          zone_plants: mergedZonePlants,
          bought_names: mergedBoughtNames,
          updated_at: new Date().toISOString()
        };

        return supabaseRequest('POST', 'user_plant_data?on_conflict=username', payload)
          .then(function () {
            _lastSyncTime = new Date();
            _syncing = false;
            emitStatus('success', '同步完成');

            // 通知外部刷新界面
            if (_dataChangeCallback) {
              _dataChangeCallback(mergedZonePlants, mergedBoughtNames);
            }
          });
      })
      .catch(function (err) {
        _syncing = false;
        emitStatus('error', '同步失败: ' + err.message);
        throw err;
      });
  }

  // ----- 自动同步 -----
  function startAutoSync(intervalMs) {
    stopAutoSync();
    var interval = intervalMs || 30000; // 默认 30 秒
    _syncTimer = setInterval(function () {
      if (_username && SUPABASE_URL && SUPABASE_ANON_KEY) {
        pushToCloud().catch(function () { /* 静默失败 */ });
      }
    }, interval);
  }

  function stopAutoSync() {
    if (_syncTimer) {
      clearInterval(_syncTimer);
      _syncTimer = null;
    }
  }

  // ----- 用户名管理 -----
  function setUsername(name) {
    if (!name || !name.trim()) return false;
    _username = name.trim();
    localStorage.setItem('sync_username', _username);
    return true;
  }

  function getUsername() {
    return _username;
  }

  function clearUsername() {
    _username = '';
    localStorage.removeItem('sync_username');
    stopAutoSync();
  }

  // ----- 配置与生命周期 -----
  function configure(opts) {
    if (opts.supabaseUrl) SUPABASE_URL = opts.supabaseUrl;
    if (opts.supabaseKey) SUPABASE_ANON_KEY = opts.supabaseKey;
    if (opts.onStatus) _statusCallback = opts.onStatus;
    if (opts.onDataChange) _dataChangeCallback = opts.onDataChange;
  }

  function isConfigured() {
    return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
  }

  function init() {
    if (_initialized) return;
    _initialized = true;
    // 如已有用户名且已配置，启动自动同步
    if (_username && isConfigured()) {
      startAutoSync();
    }
  }

  // ----- 公开 API -----
  return {
    configure: configure,
    init: init,
    setUsername: setUsername,
    getUsername: getUsername,
    clearUsername: clearUsername,
    pushToCloud: pushToCloud,
    pullFromCloud: pullFromCloud,
    smartSync: smartSync,
    startAutoSync: startAutoSync,
    stopAutoSync: stopAutoSync,
    isConfigured: isConfigured,
    getLastSyncTime: function () { return _lastSyncTime; },
    isSyncing: function () { return _syncing; }
  };

})();

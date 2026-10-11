// 暗线逻辑：口令校验、内部页面门禁、结局分支
(function () {
  'use strict';

  function g(k) {
    try { return localStorage.getItem(k) === '1'; } catch (e) { return false; }
  }
  function s(k) {
    try { localStorage.setItem(k, '1'); } catch (e) {}
  }
  function q(t) { return location.search.indexOf(t) > -1; }
  function to404() { location.replace('../404.html'); }

  var gate = document.body.getAttribute('data-gate');

  /* ---- 门禁：内部公告 / 加密档案需员工口令，抉择页需档案解锁 ---- */
  if (gate === 'staff') {
    if (!g('yc_staff') && !q('s=ok')) { to404(); return; }
  }
  if (gate === 'choice') {
    if (!g('yc_files') && !q('f=1')) { to404(); return; }
    initChoice();
    return;
  }

  /* ---- 员工通道登录 ---- */
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    var fails = 0;
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = document.getElementById('pwd').value.replace(/\s/g, '');
      var err = document.getElementById('loginErr');
      if (v === '2015047') {
        s('yc_staff');
        location.href = 'internal/notice.html?s=ok';
      } else {
        fails++;
        err.textContent = '口令错误，请重试。';
        if (fails >= 3) {
          document.getElementById('loginHint').style.display = 'block';
        }
      }
    });
  }

  /* ---- 加密档案解锁 ---- */
  var unlockForm = document.getElementById('unlockForm');
  if (unlockForm) {
    var ufails = 0;
    unlockForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = document.getElementById('fpwd').value.toLowerCase().replace(/[^a-z0-9]/g, '');
      var err = document.getElementById('unlockErr');
      if (v === '731' || v === 'yc731') {
        s('yc_files');
        document.getElementById('unlockBox').style.display = 'none';
        document.getElementById('filesPaper').style.display = 'block';
      } else {
        ufails++;
        err.textContent = '口令错误。';
        if (ufails >= 3) {
          document.getElementById('unlockHint').style.display = 'block';
        }
      }
    });
  }

  /* ---- 抉择页：选项与结局 ---- */
  function initChoice() {
    var box = document.getElementById('choiceBox');
    if (!box) return;

    var ENDINGS = {
      a: {
        title: '结局 · 曙光',
        html: '<p>你把批号、协议和公告截图整理成一个压缩包，分别发给了市食药监局和三家媒体。</p>' +
          '<p>两周后，联合执法队敲开了047店的大门。仓库里码放着整箱未开封的蓝色药水，标签上印着一行小字："YC-7号（试验品，严禁上市）"。</p>' +
          '<p>王校长被带走时还在重复："只是营养液，只是营养液……"</p>' +
          '<p>孩子们被安排做了全面体检，大多数指标会慢慢恢复。李经理在邻省落网，他的妹妹——生活主管李姐——交代了全部"观察点"的名单。</p>' +
          '<p>这个星期三，孩子们喝到的是真正的蓝莓汁。</p>'
      },
      b: {
        title: '结局 · 涟漪',
        html: '<p>你把证据发进了家长群。群里炸了整整一个晚上。</p>' +
          '<p>第二天，一半的托管费被退掉；另一半家长沉默着，准时把孩子送了回去——"双职工，没办法。"</p>' +
          '<p>一个月后，"育儿小饭桌"摘牌改名"启航托管"，菜单页焕然一新，再也找不到周三套餐的图片。</p>' +
          '<p>只有转走的小胖妈妈给你发来一条私信："谢谢你。至少我家孩子，不用再喝那个了。"</p>' +
          '<p>而在城市的另一头，益聪生物的配送车，照旧在周三清晨出发。</p>'
      },
      c: {
        title: '结局 · 沉默',
        html: '<p>你盯着屏幕看了很久，最后按下了删除键。</p>' +
          '<p>毕竟，你只是个路过的网友。万一惹上麻烦呢。</p>' +
          '<p>半年后，本地新闻播报：某托管机构多名儿童出现"原因不明的嗜睡症状"，经专家鉴定为"季节性疲劳"。你换了频道。</p>' +
          '<p>只是偶尔路过建设路，闻到饭菜的香味，你会加快脚步。</p>' +
          '<p>有些东西，你假装不知道，它就不存在了吗？</p>'
      },
      d: {
        title: '真结局 · 归零',
        html: '<p>你想起论坛上那个标签，把全部证据附上 #蓝色星期三#，发给了那位一直在蹲守的记者。</p>' +
          '<p>她等这条线索，整整八个月。</p>' +
          '<p>直播镜头里，配送车在店门口被拦下，蓝色药水一箱箱搬上执法车，弹幕刷满了同一个标签。王校长、李姐、李经理同日被采取强制措施；益聪生物全国37个"观察点"同步查封，YC-7号的试验链条被连根拔起。</p>' +
          '<p>论坛原帖下，楼主更新了最后一条回复：</p>' +
          '<p>"谢谢大家。孩子们安全了。#蓝色星期三#，今天结束。"</p>'
      }
    };

    function renderOptions() {
      var h = '<h1>凌晨两点十七分</h1>' +
        '<p>U盘里的东西，足够让047店万劫不复：服用规范、不良反应记录、试验协议，还有"双倍剂量"那一行字。</p>' +
        '<p>窗外的城市已经睡了。阳光小学的孩子们明天还要上学，而后天，是周三。</p>' +
        '<p>你打开了一个新的页面。现在，由你决定。</p>';
      h += '<a class="opt" data-k="a">A. 整理全部证据，实名举报给食药监局和媒体</a>';
      h += '<a class="opt" data-k="b">B. 先发到家长群，让家长们自己判断</a>';
      h += '<a class="opt" data-k="c">C. 删掉证据，当做什么都没看见</a>';
      if (g('yc_tag') || q('tag=1')) {
        h += '<a class="opt" data-k="d">D. 带上 #蓝色星期三# 标签，联系那位蹲守的记者</a>';
      } else {
        h += '<p class="gray-note">（你总觉得那个论坛帖子里，还有什么东西没有细看…… <a href="../forum.html">回去翻翻</a>）</p>';
      }
      box.innerHTML = h;
      var opts = box.querySelectorAll('.opt');
      for (var i = 0; i < opts.length; i++) {
        opts[i].addEventListener('click', function () {
          renderEnding(this.getAttribute('data-k'));
        });
      }
    }

    function renderEnding(k) {
      var e = ENDINGS[k];
      box.innerHTML = '<div class="ending-title">' + e.title + '</div>' + e.html +
        '<div class="back-row">' +
        '<a href="choice.html?f=1" id="again">重新抉择</a>' +
        '<a href="../forum.html">回到论坛</a>' +
        '<a href="../index.html">回到官网</a>' +
        '</div>';
      var again = document.getElementById('again');
      again.addEventListener('click', function (ev) {
        ev.preventDefault();
        renderOptions();
      });
    }

    renderOptions();
  }
})();

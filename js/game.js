// 暗线逻辑：员工门禁、各线索口令、钥匙收集、18结局渲染
(function () {
  'use strict';

  function g(k) { try { return localStorage.getItem(k) === '1'; } catch (e) { return false; } }
  function s(k) { try { localStorage.setItem(k, '1'); } catch (e) {} }
  function q(t) { return location.search.indexOf(t) > -1; }
  function to404() { location.replace('../404.html'); }

  var body = document.body;
  var gate = body.getAttribute('data-gate');
  var keyName = body.getAttribute('data-key');

  /* ---- 员工门禁：所有 internal 页面 ---- */
  if (gate === 'staff' || gate === 'summary') {
    if (!g('xft_staff') && !q('s=ok')) { to404(); return; }
  }

  /* ---- 证据页：记录已收集的钥匙 ---- */
  var KEYS = ['food', 'abuse', 'money', 'data', 'id'];
  if (keyName && KEYS.indexOf(keyName) > -1) {
    s('xft_k_' + keyName);
  }
  function keyCount() {
    var n = 0;
    for (var i = 0; i < KEYS.length; i++) {
      if (g('xft_k_' + KEYS[i])) n++;
    }
    return n;
  }

  /* ---- 员工通道登录：口令 04709 ---- */
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    var fails = 0;
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = document.getElementById('pwd').value.replace(/\s/g, '');
      var err = document.getElementById('loginErr');
      if (v === '04709') {
        s('xft_staff');
        location.href = 'internal/notice.html?s=ok';
      } else {
        fails++;
        err.textContent = '口令错误，请重试。';
        if (fails >= 3) document.getElementById('loginHint').style.display = 'block';
      }
    });
  }

  /* ---- 通用口令门：各证据页 ---- */
  function bindLock(formId, inputId, errId, hintId, okFn, testFn) {
    var f = document.getElementById(formId);
    if (!f) return;
    var n = 0;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = document.getElementById(inputId).value.replace(/\s/g, '').toLowerCase();
      if (testFn(v)) {
        okFn();
      } else {
        n++;
        document.getElementById(errId).textContent = '口令错误。';
        if (n >= 3) document.getElementById(hintId).style.display = 'block';
      }
    });
  }
  function unlock(boxId, paperId) {
    document.getElementById(boxId).style.display = 'none';
    document.getElementById(paperId).style.display = 'block';
  }

  // 午休监控：1230
  bindLock('cctvForm', 'cpwd', 'cctvErr', 'cctvHint', function () {
    unlock('cctvBox', 'cctvPaper'); s('xft_k_abuse');
  }, function (v) { return v === '1230'; });

  // 捐款台账：1109
  bindLock('ledgerForm', 'lpwd', 'ledgerErr', 'ledgerHint', function () {
    unlock('ledgerBox', 'ledgerPaper'); s('xft_k_money');
  }, function (v) { return v === '1109'; });

  // 名单对接：1247
  bindLock('partnerForm', 'ppwd', 'partnerErr', 'partnerHint', function () {
    unlock('partnerBox', 'partnerPaper'); s('xft_k_data');
  }, function (v) { return v === '1247'; });

  // 人事档案：009
  bindLock('hrForm', 'hpwd', 'hrErr', 'hrHint', function () {
    unlock('hrBox', 'hrPaper'); s('xft_k_id');
  }, function (v) { return v === '009' || v === '9' || v === 'yx009' || v === 'yx-009'; });

  /* ---- 总结页：集齐5把钥匙后解锁全部真相 ---- */
  if (gate === 'summary') {
    var n2 = keyCount();
    var prog = document.getElementById('keyProg');
    var full = document.getElementById('fullPaper');
    if (prog && full) {
      if (n2 >= 5) {
        prog.style.display = 'none';
        full.style.display = 'block';
      } else {
        document.getElementById('keyNum').textContent = n2;
      }
    }
    // 真结局选项：需要论坛标签
    var optD = document.getElementById('opt18');
    var noD = document.getElementById('no18');
    if (optD) {
      if (g('xft_tag') || q('tag=1')) {
        optD.style.display = 'block';
      } else if (noD) {
        noD.style.display = 'block';
      }
    }
  }

  /* ---- 结局页渲染：ending.html?e=1..18 ---- */
  var endBox = document.getElementById('endingBox');
  if (endBox) {
    var ENDINGS = {
      '1': { t: '结局 · 清仓', h: '<p>你把留样照片和采购台账打印出来，第二天一早就送进了市市场监管局。</p><p>执法人员到场时，后厨冰柜里还冻着三箱生产日期为2025年11月的"香酥鸡排"。李记冻品的送货单厚厚一沓，没有一张带检疫章。</p><p>047店当天停业整顿，一周后摘牌。家长们排队退费，园长王某在窗口反复强调："我们也是受害者，是加盟商自己采购的……"</p><p>而孩子们这个星期的午餐，是家长们轮流送的。</p>' },
      '2': { t: '结局 · 红包', h: '<p>你拿着台账照片直接找到了园长办公室。</p><p>王某看完照片，沉默了几秒，从抽屉里拿出一个厚厚的红包推过来："兄弟，孩子吃饭的事，我们马上整改。这点心意，您喝茶。"</p><p>你捏着红包走出店门，厚度大概五千。第二天，菜单页悄悄换掉了"香酥鸡排"，留样记录依旧每天更新，字迹工整。</p><p>只是冰柜最底层那三箱冻品，从来没有人去动过。</p>' },
      '3': { t: '结局 · 造谣者', h: '<p>你把证据发进了家长群，@了所有人。</p><p>十分钟后，群主的夫人——生活主管在群里回复："个别家长恶意造谣，本店保留追究法律责任的权利。"随后你被移出群聊。</p><p>有家长私聊你："就算是真的，你小点声，孩子还在人家手里吃饭呢。"</p><p>周三中午，孩子们照常吃着香酥鸡排。你在群外，什么也做不了。</p>' },
      '4': { t: '结局 · 十二点半', h: '<p>你把监控日志拷进U盘，直接报了警。</p><p>民警调取了12:30之后的原始录像：罚站的孩子贴着墙根站成一排，"不安静"的被带进储藏间"冷静"，最长的一次是四十分钟。</p><p>生活主管被行政拘留，047店被吊销托管资质。通报里写着："以\'安静管理\'为名实施变相体罚。"</p><p>后来有家长认出你，在小学门口朝你深深鞠了一躬。</p>' },
      '5': { t: '结局 · 转园', h: '<p>你看完监控，一夜没睡。第二天，你只把链接发给了最熟的三位家长。</p><p>三个家庭悄悄办了退托，转到另一家托管。其余四十多个孩子，依然在12:30之后接受"安静管理"。</p><p>你在心里告诉自己：我自己的孩子不在这儿，我凭什么管？</p><p>可每次路过那扇紧闭的午休室大门，你都会想起监控里贴墙站着的那一排小影子。</p>' },
      '6': { t: '结局 · 被告席', h: '<p>你把监控视频原样传到了网上，配文"看看这家小饭桌的真面目"。</p><p>视频火了，但第三天你就收到了律师函：监控画面未经处理，泄露了四十多名未成年人的面部信息，047店反诉你侵犯隐私权、名誉权。</p><p>法院最终调解：你公开道歉并删除视频。体罚的事，因为"证据获取途径不合法"，没有了下文。</p><p>评论区里有人留言："好心没好报，下次谁还敢管？"</p>' },
      '7': { t: '结局 · 对账单', h: '<p>你把台账截图发给了店庆募捐群里最活跃的十几位家长，提议成立"查账小组"。</p><p>家长们带着公示页和台账找到店里，王某一开始矢口否认，直到有人当场拨通了街道民政办的电话。</p><p>经协调，挪用款项被限期退回，募捐余额由家长代表监督用于更换午休室设施。047店被街道列入重点监管名单。</p><p>查账群的名字，后来被改成了"047监督群"，一直保留到今天。</p>' },
      '8': { t: '结局 · 黑名单', h: '<p>你一个人找到店里，要求出示捐款明细。</p><p>前台客客气气记下你的电话，说"财务三天内回复"。第四天，你发现自己打不通店里的任何电话——你的号码被拉黑了。</p><p>你去店门口等，保安隔着玻璃摆手；你发的质疑帖，隔天就被投诉删除。</p><p>那笔86520元的捐款，公示页上依然写着"全部用于硬件升级"，无人再问。</p>' },
      '9': { t: '结局 · 爱心家长', h: '<p>看完台账，你沉默了很久，最后关掉了页面。</p><p>"钱大概是真的花了吧。"你这样想。第二年店庆，募捐链接又发了出来，你照例捐了两百。</p><p>公示页上的数字变成了九万六，明细依旧写着"硬件升级"。午休室的床，还是三年前那批。</p><p>你的两百块去了哪里，你不知道，也不想知道。</p>' },
      '10': { t: '结局 · 来电显示', h: '<p>你把名单交接表和"0.8元/条"的计费记录，一并提交给了公安局网安大队和网信办举报平台。</p><p>三周后通报下来：047店非法出售公民个人信息11000余条，园长王某与启航教育负责人被立案侦查。</p><p>新闻播出那天，许多家长发现，骚扰电话突然安静了。</p><p>有家长在群里问："是哪位好心人举报的？"没有人回答，但大家都存了一个来电——那是通报里的举报电话。</p>' },
      '11': { t: '结局 · 新号码', h: '<p>你核实了自己报名时留的号码，第二天就去营业厅办了销号。</p><p>新号码清净了，再也没有"启航教育"的推销。</p><p>可名单交接表上还有一万多个号码。每当午休时间你路过阳光小学，总能看见校门口有家长接起电话，皱着眉说："不需要，谢谢。"</p><p>你的问题解决了。别人的，还在响。</p>' },
      '12': { t: '结局 · 免费试听', h: '<p>你拿着交接表找到启航教育，要求"给个说法"。</p><p>课程顾问满脸堆笑："哥，这是个误会。这样，送您孩子十节免费试听课，就当赔罪。"</p><p>十节课上完，顾问又来电话："孩子进步特别大，报个年卡吧，给您打八折。"你稀里糊涂刷了卡。</p><p>至于那张交接表，再没有人提起。你的号码，依然在他们的"精准客户"名单里——备注从"待开发"改成了"已成交"。</p>' },
      '13': { t: '结局 · 通缉令', h: '<p>你把工号、入职登记表和那张"证件补办中"的记录整理成匿名材料，寄给了市公安局。</p><p>警方比对后发现："保育员刘姨"与2023年邻省特大非法集资案在逃人员刘某琴系同一人，案发后冒用他人身份潜伏至今。</p><p>抓捕那天，孩子们正在吃午饭。警察等她给孩子们盛完最后一碗汤，才上前亮明身份。</p><p>有孩子问："刘姨要去哪儿？"老师说："刘姨……要回很远的地方。"</p>' },
      '14': { t: '结局 · 空床铺', h: '<p>你在接孩子的人群中拦住了"刘姨"，把手机里的档案页面举到她面前。</p><p>她的脸色在那一瞬间就变了，一句话没说，转身走进了员工通道。</p><p>第二天，她没有来上班。宿舍的床铺空了，行李连夜搬走，电话成了空号。警方赶到时，监控显示她凌晨三点提着行李箱上了长途汽车。</p><p>通缉令上的追逃信息，又多了一条"疑似流窜"。而你总会想：如果那天换一种方式，是不是就不会惊动她。</p>' },
      '15': { t: '结局 · 同桌吃饭', h: '<p>你盯着那份档案看了很久，最后清空了浏览记录。</p><p>"也许只是长得像吧。"你说服了自己。第二天路过门店，你照常和门口的"刘姨"点头打招呼。</p><p>她依然每天给孩子们盛饭、铺床、梳头。家长们依然夸她"对孩子有耐心"。</p><p>只有你知道，通缉令上的那双眼睛，和眼前这双，一模一样。这个秘密，你打算带进肚子里。</p>' },
      '16': { t: '结局 · 头条', h: '<p>你把五条线的全部证据——过期冻品、午休监控、捐款台账、名单交接表、人事档案——整理成一个压缩包，发给了本地最大的民生媒体。</p><p>报道在周五晚高峰发出，标题只有六个字：《小饭桌，大问题》。阅读量两小时破百万。</p><p>047店连夜摘牌，品牌方宣布"终止加盟合作"。园长王某被立案调查。</p><p>可你知道，这家连锁还有36家门店。报道只写了047店——因为证据，只够写047店。</p>' },
      '17': { t: '结局 · 通报', h: '<p>你把全部材料按线索分类，分别寄给了市场监管、民政、公安、网信四个部门。</p><p>半个月后，各部门各自发了通报：食品安全约谈、募捐资金清退、信息泄露立案、在逃人员协查。每一份通报都不长，措辞谨慎，没有提到彼此。</p><p>047店换了招牌、换了园长，继续营业。午休室的床换了新的。</p><p>问题被"解决"了，分成了五份，每一份看起来都不大。</p>' },
      '18': { t: '真结局 · 饭盒见底', h: '<p>你想起论坛里那个 #黑饭盒# 标签，把五条线的全部证据按标签格式整理好，发给了那位一直在蹲守的爆料人——她的真实身份，是省报调查记者。</p><p>她等这份完整的拼图，等了整整一年。</p><p>报道刊发当天，连锁品牌总部被查封：所谓"37家直营店"，实为只收钱不管理的空壳加盟，五条黑幕在多家门店同时上演。监管风暴席卷整个行业，托管机构准入新规在三个月后出台。</p><p>论坛原帖下，楼主更新了最后一条回复：</p><p>"饭盒见底了。谢谢每一个没有划走的人。#黑饭盒#，封存。"</p>' }
    };
    var m = location.search.match(/[?&]e=(\d+)/);
    var id = m ? m[1] : '';
    var data = ENDINGS[id];
    if (!data) {
      endBox.innerHTML = '<p class="gray-note">这一页似乎不存在。<a href="index.html">回到首页</a></p>';
    } else {
      endBox.innerHTML = '<div class="ending-title">' + data.t + '</div>' + data.h +
        '<div class="back-row">' +
        '<a href="forum.html">回到论坛</a>' +
        '<a href="index.html">回到官网</a>' +
        '</div>';
    }
  }
})();

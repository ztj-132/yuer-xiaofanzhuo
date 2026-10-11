// 官网通用交互：轮播、模态大图、加载更多、论坛小交互
(function () {
  'use strict';

  /* ---- 首页轮播 ---- */
  var slides = document.querySelectorAll('.carousel .slide');
  if (slides.length > 0) {
    var dotsBox = document.querySelector('.dots');
    var cur = 0;
    var dots = [];
    for (var i = 0; i < slides.length; i++) {
      var d = document.createElement('i');
      if (i === 0) d.className = 'on';
      dotsBox.appendChild(d);
      dots.push(d);
    }
    setInterval(function () {
      slides[cur].classList.remove('on');
      dots[cur].classList.remove('on');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('on');
      dots[cur].classList.add('on');
    }, 4000);
  }

  /* ---- 模态框（菜品大图 / 益聪logo） ---- */
  function bindModal(triggerId, maskId) {
    var t = document.getElementById(triggerId);
    var m = document.getElementById(maskId);
    if (!t || !m) return;
    t.addEventListener('click', function () { m.classList.add('show'); });
    m.addEventListener('click', function (e) {
      if (e.target === m || e.target.className === 'modal-close') m.classList.remove('show');
    });
  }
  bindModal('dishZoom', 'dishModal');
  bindModal('ycLogo', 'ycModal');
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var ms = document.querySelectorAll('.modal-mask.show');
      for (var i = 0; i < ms.length; i++) ms[i].classList.remove('show');
    }
  });

  /* ---- 家长反馈：加载更多 ---- */
  var moreBtn = document.getElementById('moreFb');
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      var hidden = document.querySelectorAll('.fb-hidden');
      for (var i = 0; i < hidden.length; i++) {
        hidden[i].style.display = 'block';
      }
      moreBtn.style.display = 'none';
    });
  }

  /* ---- 论坛：隐藏话题标签 ---- */
  var tag = document.getElementById('blueTag');
  var pop = document.getElementById('tagPop');
  if (tag && pop) {
    tag.addEventListener('click', function (e) {
      try { localStorage.setItem('yc_tag', '1'); } catch (err) {}
      pop.style.left = (e.clientX + 12) + 'px';
      pop.style.top = (e.clientY - 36) + 'px';
      pop.style.display = 'block';
      tag.style.color = '#8fd0ff';
      setTimeout(function () { pop.style.display = 'none'; }, 2600);
    });
  }
})();

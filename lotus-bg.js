(() => {
  const LOTUS_COUNT = 16;
  const PETAL_BURST_COUNT = 14;
  const WAVE_MAX_RADIUS_PX = 460;
  /** ~px «задержка старта» фронта относительно центра клика (подгонка к радиальному фону) */
  const WAVE_START_RADIUS_PX = 11;
  const GLOBAL_WAVE_DURATION_MS = 2300;
  const WAVE_HIT_ANIM_MS = 1720;
  const FLOAT_TICK_MS = 48;
  const LOTUS_QUOTES = [
    "Отпусти то, что не принадлежит тебе. Освободившись, ты надолго обретешь счастье и благо.",
    "Нелепо думать, что кто-то, кроме тебя, сможет сделать тебя счастливым или несчастным.",
    "Если, отказавшись от меньшего счастья, можно достичь большего, то пусть мудрый откажется от меньшего в надежде обрести большее.",
    "Счастье не придет к тем, кто не умеет ценить того, что уже имеет.",
    "Большая гордость приведет к падению, а смирение - к победе.",
    "Созерцание - произведение добра. Дисциплина - произведение благословенной красоты.",
    "Учитель приходит, когда ученик готов.",
    "Все, чем мы являемся, - это результат того, о чем мы думаем. Разум - это все. Мысли материальны.",
    "Не искажайте труды других и не портите своих.",
    "Все понять - значит все простить.",
    "Победить себя - это более великая задача, чем победить других.",
    "Повторяйте бесконечно безупречное действие, и вашей религией станет мудрость.",
    "Преврати свою жизнь в гирлянду красивых дел.",
    "Доброта - инструктор мира.",
    "Шесть дней для работы, один день для отдыха - идеальная комбинация.",
    "Освободи душу от страха и зависти. Это важнейший шаг в обретении свободы.",
    "Разум может достичь своего предела, когда он начинает задумываться о сути дела.",
    "Не жадничай. Нет такой силы в мире, которая могла бы захватить вечное счастье.",
    "Наши печали и раны исцеляются только тогда, когда мы прикасаемся к ним с состраданием.",
    "Цепляться за чувство гнева - это как пить яд и ожидать, что вместо вас умрет другой человек.",
    "Внешний враг существует только тогда, когда гнев присутствует внутри тебя.",
    "Истинная любовь рождается из понимания.",
    "Если нужно что-то сделать, делай это от всего сердца.",
    "Если ты по-настоящему любишь себя, ты никогда не сможешь причинить боль другому.",
    "В этом мире ненависть никогда не искоренить с помощью ненависти. Победить ненависть сможет только любовь. Это вечный закон."
  ];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function pickEdgePosition() {
    // Keep center area cleaner for text cards.
    const zone = Math.floor(random(0, 4)); // 0:left, 1:right, 2:top, 3:bottom
    if (zone === 0) return { left: random(3, 16), top: random(8, 92) };
    if (zone === 1) return { left: random(84, 97), top: random(8, 92) };
    if (zone === 2) return { left: random(8, 92), top: random(4, 18) };
    return { left: random(8, 92), top: random(82, 96) };
  }

  function createBurstPieces(lotus) {
    for (let i = 0; i < PETAL_BURST_COUNT; i += 1) {
      const piece = document.createElement("span");
      piece.className = "lotus-burst-piece";
      const angle = random(0, Math.PI * 2);
      const distance = random(42, 138);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - random(10, 34);
      piece.style.setProperty("--dx", `${dx.toFixed(2)}px`);
      piece.style.setProperty("--dy", `${dy.toFixed(2)}px`);
      piece.style.setProperty("--rot", `${random(-260, 260).toFixed(0)}deg`);
      piece.style.setProperty("--dur", `${random(0.85, 1.45).toFixed(2)}s`);
      piece.style.setProperty("--delay", `${random(0, 0.22).toFixed(2)}s`);
      piece.style.setProperty("--end-scale", `${random(1.05, 1.95).toFixed(2)}`);
      piece.style.setProperty("--lift", `${random(7, 22).toFixed(2)}px`);
      lotus.appendChild(piece);
    }
  }

  function createLotus() {
    const lotus = document.createElement("button");
    lotus.className = "lotus-bg__item";
    lotus.type = "button";
    lotus.setAttribute("aria-label", "Лотос");
    const pos = pickEdgePosition();
    lotus.style.left = `${pos.left}%`;
    lotus.style.top = `${pos.top}%`;
    lotus.style.setProperty("--lotus-size", `${random(34, 68)}px`);
    lotus.style.setProperty("--appear-delay", `${random(0, 8).toFixed(1)}s`);
    lotus.style.setProperty("--sway-dur", `${random(3.5, 7).toFixed(1)}s`);
    lotus.style.setProperty("--sway-x", `${random(-6, 6).toFixed(1)}px`);
    lotus.style.setProperty("--sway-y", `${random(-5, 5).toFixed(1)}px`);
    lotus.style.setProperty("--rot-delta", `${random(-4, 4).toFixed(1)}deg`);
    lotus.style.setProperty("--float-x", "0px");
    lotus.style.setProperty("--float-y", "0px");
    lotus.style.setProperty("--float-rot", "0deg");

    const z = Math.round(random(0, 3));
    lotus.style.zIndex = String(z);
    const maxOpacity = clamp(0.15 + z * 0.03 + random(0, 0.04), 0.14, 0.28);
    lotus.style.setProperty("--lotus-opacity", maxOpacity.toFixed(2));

    lotus.innerHTML = `
      <span class="lotus-flower">
        <span class="lotus-core"></span>
        <span class="lotus-petal p1"></span>
        <span class="lotus-petal p2"></span>
        <span class="lotus-petal p3"></span>
        <span class="lotus-petal p4"></span>
        <span class="lotus-petal p5"></span>
        <span class="lotus-petal p6"></span>
        <span class="lotus-petal p7"></span>
        <span class="lotus-petal p8"></span>
        <span class="lotus-petal p9"></span>
        <span class="lotus-petal p10"></span>
        <span class="lotus-petal p11"></span>
        <span class="lotus-petal p12"></span>
        <span class="lotus-petal back b1"></span>
        <span class="lotus-petal back b2"></span>
        <span class="lotus-petal back b3"></span>
        <span class="lotus-petal back b4"></span>
        <span class="lotus-petal back b5"></span>
        <span class="lotus-petal back b6"></span>
      </span>
      <span class="lotus-wave"></span>
    `;

    createBurstPieces(lotus);

    lotus.addEventListener("click", (event) => {
      event.preventDefault();
      lotus.classList.remove("burst");
      // restart animation
      void lotus.offsetWidth;
      lotus.classList.add("burst");
      lotus.classList.add("vanish");

      const rect = lotus.getBoundingClientRect();
      const pageX = rect.left + rect.width / 2 + window.scrollX;
      const pageY = rect.top + rect.height / 2 + window.scrollY;
      triggerBackgroundWave(pageX, pageY);
      impactNearbyElements(pageX, pageY);
      showLotusQuote(pageX, pageY);
    });

    return lotus;
  }

  function startChaoticFloat(layer) {
    const lotuses = Array.from(layer.querySelectorAll(".lotus-bg__item"));
    if (!lotuses.length) return;

    const states = lotuses.map((lotus) => ({
      lotus,
      x: random(-8, 8),
      y: random(-8, 8),
      vx: random(-0.22, 0.22),
      vy: random(-0.22, 0.22),
      rot: random(-2, 2),
      vRot: random(-0.055, 0.055),
      ampX: random(7, 18),
      ampY: random(7, 18),
      drift: random(0.75, 1.45),
      noisePhaseX: random(0, Math.PI * 2),
      noisePhaseY: random(0, Math.PI * 2),
      noiseSpeedX: random(0.0012, 0.0027),
      noiseSpeedY: random(0.001, 0.0024),
      maxX: random(14, 28),
      maxY: random(12, 26),
      maxRot: random(4.8, 9.8),
    }));

    let lastTs = performance.now();
    window.setInterval(() => {
      const now = performance.now();
      const dtMs = Math.min(80, now - lastTs);
      lastTs = now;
      const dt = dtMs / 16.6667;

      states.forEach((state) => {
        if (state.lotus.classList.contains("vanish")) return;

        state.vx += random(-0.036, 0.036) * state.drift;
        state.vy += random(-0.036, 0.036) * state.drift;
        state.vRot += random(-0.008, 0.008);

        state.vx *= 0.94;
        state.vy *= 0.94;
        state.vRot *= 0.91;

        state.x += state.vx * dt;
        state.y += state.vy * dt;
        state.rot += state.vRot * dt;

        if (Math.abs(state.x) > state.maxX) state.vx += state.x > 0 ? -0.16 : 0.16;
        if (Math.abs(state.y) > state.maxY) state.vy += state.y > 0 ? -0.16 : 0.16;
        if (Math.abs(state.rot) > state.maxRot) state.vRot += state.rot > 0 ? -0.06 : 0.06;

        const noiseX = Math.sin(now * state.noiseSpeedX + state.noisePhaseX) * state.ampX;
        const noiseY = Math.cos(now * state.noiseSpeedY + state.noisePhaseY) * state.ampY;
        const finalX = clamp(state.x + noiseX * 0.36, -state.maxX, state.maxX);
        const finalY = clamp(state.y + noiseY * 0.36, -state.maxY, state.maxY);
        const finalRot = clamp(state.rot + (noiseX - noiseY) * 0.095, -state.maxRot, state.maxRot);

        state.lotus.style.setProperty("--float-x", `${finalX.toFixed(2)}px`);
        state.lotus.style.setProperty("--float-y", `${finalY.toFixed(2)}px`);
        state.lotus.style.setProperty("--float-rot", `${finalRot.toFixed(2)}deg`);
      });
    }, FLOAT_TICK_MS);
  }

  function syncLayerHeight(layer) {
    const doc = document.documentElement;
    const body = document.body;
    const maxHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      doc.clientHeight,
      doc.scrollHeight,
      doc.offsetHeight
    );
    layer.style.height = `${maxHeight}px`;
  }

  let wavePulseRoot;
  let lotusQuoteRoot;
  let lastQuoteIndex = -1;

  function getWavePulseRoot() {
    if (wavePulseRoot) return wavePulseRoot;
    wavePulseRoot = document.createElement("div");
    wavePulseRoot.className = "lotus-bg-wave-pulse";
    wavePulseRoot.setAttribute("aria-hidden", "true");
    document.body.insertBefore(wavePulseRoot, document.body.firstChild);
    return wavePulseRoot;
  }

  function getLotusQuoteRoot() {
    if (lotusQuoteRoot) return lotusQuoteRoot;
    lotusQuoteRoot = document.createElement("div");
    lotusQuoteRoot.className = "lotus-quote-layer";
    lotusQuoteRoot.setAttribute("aria-hidden", "true");
    document.body.insertBefore(lotusQuoteRoot, document.body.firstChild);
    return lotusQuoteRoot;
  }

  function getDocumentHeight() {
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      doc.clientHeight,
      doc.scrollHeight,
      doc.offsetHeight
    );
  }

  function pickQuoteText() {
    if (LOTUS_QUOTES.length < 2) return LOTUS_QUOTES[0] || "";
    let idx = Math.floor(random(0, LOTUS_QUOTES.length));
    if (idx === lastQuoteIndex) idx = (idx + 1) % LOTUS_QUOTES.length;
    lastQuoteIndex = idx;
    return LOTUS_QUOTES[idx];
  }

  function showLotusQuote(pageX, pageY) {
    const root = getLotusQuoteRoot();
    const quote = document.createElement("div");
    quote.className = "lotus-quote";
    quote.textContent = pickQuoteText();

    const documentHeight = getDocumentHeight();
    root.style.height = `${documentHeight}px`;

    // First render quote, then clamp by its real dimensions.
    quote.style.left = `${pageX.toFixed(1)}px`;
    quote.style.top = `${(pageY - 88).toFixed(1)}px`;
    quote.style.visibility = "hidden";

    root.appendChild(quote);
    const rect = quote.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;
    const viewportLeft = window.scrollX;
    const viewportRight = window.scrollX + document.documentElement.clientWidth;
    const padding = 14;
    const x = clamp(pageX, viewportLeft + halfW + padding, viewportRight - halfW - padding);
    const y = clamp(pageY - 88, halfH + padding, documentHeight - halfH - padding);

    quote.style.left = `${x.toFixed(1)}px`;
    quote.style.top = `${y.toFixed(1)}px`;
    quote.style.visibility = "visible";

    window.setTimeout(() => quote.remove(), 6200);
  }

  function triggerBackgroundWave(pageX, pageY) {
    const el = getWavePulseRoot();
    const vx = ((pageX - window.scrollX) / Math.max(1, window.innerWidth)) * 100;
    const vy = ((pageY - window.scrollY) / Math.max(1, window.innerHeight)) * 100;
    el.style.setProperty("--wave-vx", `${vx.toFixed(2)}%`);
    el.style.setProperty("--wave-vy", `${vy.toFixed(2)}%`);
    el.classList.remove("lotus-bg-wave-pulse--on");
    void el.offsetWidth;
    el.classList.add("lotus-bg-wave-pulse--on");
    window.setTimeout(() => el.classList.remove("lotus-bg-wave-pulse--on"), 2600);
  }

  function waveFrontDelayMs(distance) {
    if (distance <= WAVE_START_RADIUS_PX) return 0;
    if (distance >= WAVE_MAX_RADIUS_PX) return GLOBAL_WAVE_DURATION_MS;
    const span = WAVE_MAX_RADIUS_PX - WAVE_START_RADIUS_PX;
    return ((distance - WAVE_START_RADIUS_PX) / span) * GLOBAL_WAVE_DURATION_MS;
  }

  function impactNearbyElements(pageX, pageY) {
    const targets = document.querySelectorAll(
      "h1,h2,h3,h4,p,li,a,.card,.tradition-card,.kalm-card-item,.media-card,.audio-track,.content-card,.info-pill,.quote-card,button"
    );
    targets.forEach((el) => {
      if (el.closest(".lotus-bg")) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 + window.scrollX;
      const cy = rect.top + rect.height / 2 + window.scrollY;
      const dx = cx - pageX;
      const dy = cy - pageY;
      const distance = Math.hypot(dx, dy);
      if (distance > WAVE_MAX_RADIUS_PX) return;

      const power = 1 - distance / WAVE_MAX_RADIUS_PX;
      const shift = power * 14;
      const nx = distance === 0 ? 0 : dx / distance;
      const ny = distance === 0 ? 0 : dy / distance;

      const delay = waveFrontDelayMs(distance);
      window.setTimeout(() => {
        el.style.setProperty("--wave-x", `${(nx * shift).toFixed(2)}px`);
        el.style.setProperty("--wave-y", `${(ny * shift).toFixed(2)}px`);
        el.style.setProperty("--wave-power", power.toFixed(3));
        el.classList.remove("lotus-wave-hit");
        void el.offsetWidth;
        el.classList.add("lotus-wave-hit");
        window.setTimeout(() => el.classList.remove("lotus-wave-hit"), WAVE_HIT_ANIM_MS);
      }, delay);
    });
  }

  function initLotusBackground() {
    document.getElementById("lotus-wave-filter-svg")?.remove();
    getWavePulseRoot();
    getLotusQuoteRoot();

    const layer = document.createElement("div");
    layer.className = "lotus-bg";
    layer.setAttribute("aria-hidden", "true");

    for (let i = 0; i < LOTUS_COUNT; i += 1) {
      layer.appendChild(createLotus());
    }

    const anchor = wavePulseRoot.nextSibling;
    if (anchor) document.body.insertBefore(layer, anchor);
    else document.body.appendChild(layer);
    syncLayerHeight(layer);
    startChaoticFloat(layer);
    window.addEventListener("resize", () => syncLayerHeight(layer));
    window.addEventListener("load", () => syncLayerHeight(layer));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLotusBackground, { once: true });
  } else {
    initLotusBackground();
  }
})();


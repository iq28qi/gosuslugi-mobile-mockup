    // Additional screens from the supplied reference archive. All state stays
    // in this browser session; there are no government or payment requests.
    const serviceGroups = [
      ['Популярные услуги', 'heart'], ['Здоровье', 'health'], ['Справки Выписки', 'folder'],
      ['Пенсии Пособия', 'pension'], ['Транспорт Права', 'car'], ['Семья', 'family'],
      ['Образование', 'book'], ['Регистрация Паспорт', 'passport'], ['Штрафы Налоги', 'justice'],
      ['Земля Дом', 'home-icon'], ['Прочее', 'grid'], ['Ведомства', 'agencies']
    ];
    const documentGroups = [
      ['Личные документы', 'passport'], ['Семья и дети', 'family'], ['Транспорт', 'car'],
      ['Здоровье', 'health'], ['Недвижимость', 'home-icon'], ['Работа и пенсия', 'sign'],
      ['Образование', 'book'], ['Льготы и выплаты', 'pension'], ['Доходы и налоги', 'ruble'],
      ['Нотариальные документы', 'file'], ['Правопорядок', 'justice'], ['Интеллектуальные права', 'copyright'],
      ['Карта болельщика Билеты', 'fan'], ['Оружие', 'weapon'], ['Цифровой архив', 'archive']
    ];
    const profileGroups = [
      ['Сим-карты', 'sim'], ['Банковские карты и счета', 'card'], ['Электронная подпись', 'sign'],
      ['Согласия', 'check'], ['Доверенности и разрешения', 'permit'], ['Безопасность', 'lock'],
      ['Биометрия', 'face'], ['Настройки уведомлений', 'bell'], ['Настройки госпочты', 'mail'],
      ['Отделения и МФЦ', 'pin'], ['Помощь и поддержка', 'help'], ['Тема оформления', 'moon'],
      ['Скорость интернета', 'speed'], ['О приложении', 'file']
    ];
    const categoryContent = {
      'Популярные услуги': ['Запись к врачу', 'Справки и выписки', 'Замена паспорта', 'Запись в школу'],
      'Здоровье': ['Запись к врачу', 'Вызов врача на дом', 'Медицинские документы'],
      'Справки Выписки': ['Справка об отсутствии судимости', 'Выписка из ЕГРН', 'Справка о доходах'],
      'Пенсии Пособия': ['Единое пособие', 'Пенсионные накопления', 'Социальные выплаты'],
      'Транспорт Права': ['Водительское удостоверение', 'Регистрация автомобиля', 'Штрафы'],
      'Семья': ['Рождение ребёнка', 'Материнский капитал', 'Регистрация брака'],
      'Образование': ['Поступление в колледж', 'Запись в школу', 'Моя школа'],
      'Регистрация Паспорт': ['Паспорт РФ', 'Регистрация по месту жительства', 'Загранпаспорт'],
      'Личные документы': ['Паспорт РФ', 'СНИЛС', 'ИНН'],
      'Семья и дети': ['Свидетельство о рождении', 'Свидетельство о браке'],
      'Транспорт': ['Водительское удостоверение', 'Свидетельство о регистрации ТС'],
      'Недвижимость': ['Выписка из ЕГРН'], 'Работа и пенсия': ['Электронная трудовая книжка', 'Пенсионные накопления'],
      'Штрафы Налоги': ['Штрафы', 'Налоговые начисления'], 'Земля Дом': ['Выписка из ЕГРН', 'Субсидии ЖКХ'],
      'Прочее': ['Сервисы и приложения', 'Карта болельщика'], 'Ведомства': ['МВД России', 'Социальный фонд России'],
      'Карта болельщика Билеты': ['Карта болельщика', 'Билеты'], 'Цифровой архив': ['Фото и сканы документов']
    };
    const uiParents = {};
    const localSettings = { push: true, mail: true };
    const attachmentUrls = new Set();
    let notificationFilter = 'all';
    let notificationArchive = false;
    let unreadTotal = 24;
    const notificationData = [
      { type: 'новости', date: '02.10 в 19:53', title: 'Поздравьте учителя', source: 'Госуслуги', text: 'Выберите тёплые слова и поздравьте вашего учителя с профессиональным праздником.' },
      { type: 'госпочта', date: '02.10 в 14:50', title: 'С днём рождения, Димитрий Александрович!', source: 'Портал Госуслуг', text: 'Поздравляем с днём рождения! Желаем здоровья, счастья и исполнения желаний.' },
      { type: 'новости', date: '26.09 в 04:05', title: 'Поддержите сборную России по футболу', source: 'Госуслуги', text: 'Поддержите сборную России и следите за новостями команды.' },
      { type: 'документы', date: '19.09 в 04:49', title: 'Протоколы консультаций', source: 'Добавлен новый медицинский документ', medical: true, text: 'Просмотр медицинских документов пока недоступен.' },
      { type: 'документы', date: '18.09 в 18:26', title: 'Протоколы консультаций', source: 'Добавлен новый медицинский документ', medical: true, text: 'Просмотр медицинских документов пока недоступен.' },
      { type: 'новости', date: '30.07 в 14:53', title: 'Опрос по подготовке к ЕГЭ', source: 'Госуслуги', text: 'Примите участие в опросе по подготовке к единому государственному экзамену.' },
      { type: 'новости', date: '28.07 в 09:54', title: 'Сохраните безопасный доступ к важным сайтам', source: 'Госуслуги', text: 'Установите сертификаты безопасности для бесперебойного доступа к порталу.' },
      { type: 'новости', date: '24.07 в 17:08', title: 'Стартует Чемпионат болельщиков', source: 'Госуслуги', text: 'Оформите Карту болельщика и посещайте матчи с комфортом.' },
      { type: 'новости', date: '09.07 в 00:01', title: 'Заселитесь в отель без паспорта', source: 'Госуслуги', text: 'Теперь в гостиницах можно подтвердить личность с помощью приложения Госуслуги.' },
      { type: 'новости', date: '07.07 в 20:57', title: 'Воспользуйтесь сервисом подбора колледжей', source: 'Госуслуги', text: 'Сервис поможет выбрать специальность и подать заявление онлайн.' }
    ].map(item => ({ ...item, read: false }));

    const referenceMenuIcons = REFERENCE_MENU_ICONS;
    function uiIcon(name, className = '') {
      const source = referenceMenuIcons['menu' + name];
      if (source) return '<img class="menu-icon ' + className + '" src="' + source + '" alt="" aria-hidden="true">';
      const nativeIds = ['home-icon', 'grid', 'file', 'bell', 'wallet'];
      return '<svg class="' + className + '" aria-hidden="true"><use href="#' + (nativeIds.includes(name) ? name : 'icon-' + name) + '"/></svg>';
    }
    function menuRows(target, groups, callback) {
      const fragment = document.createDocumentFragment();
      for (const [title, icon] of groups) {
        const button = document.createElement('button');
        button.className = 'menu-row';
        button.innerHTML = uiIcon(icon) + '<strong></strong><svg class="row-chevron" aria-hidden="true"><use href="#next"/></svg>';
        button.querySelector('strong').textContent = title;
        button.addEventListener('click', () => callback(title));
        fragment.append(button);
      }
      $(target).replaceChildren(fragment);
    }
    function openScreen(id) {
      uiParents[id] = currentScreen;
      $(id).scrollTop = 0;
      navigate(id, true);
    }
    function openTab(id) {
      navigate(id, false, 'tab');
      history.replaceState({ screen: id }, '');
    }
    function goBack() {
      if (history.state?.screen === currentScreen && !['home', 'pin', 'splash'].includes(currentScreen)) history.back();
      else navigate(uiParents[currentScreen] || 'home', false, 'back');
    }
    function services() { openTab('servicesScreen'); }
    function documents() { openTab('documentsScreen'); }
    function payments() { openTab('paymentsScreen'); }
    function showProfile() { openScreen('profileScreen'); }
    function openAssistant() { openScreen('assistantScreen'); }
    function openPassportDetails() { openScreen('passportDetails'); }
    function openMaxInstall() { openScreen('maxInstallScreen'); }
    function openCatalog() { openScreen('catalogScreen'); }
    function openNotifications() { openScreen('notificationsScreen'); }

    let faceIdTimer = null;
    window.closeFaceIdPreview = () => {
      clearTimeout(faceIdTimer);
      const overlay = $('faceIdOverlay');
      if (!overlay.classList.contains('open')) return;
      overlay.classList.remove('open', 'success');
      overlay.inert = true;
      overlay.setAttribute('aria-hidden', 'true');
      $('phone').classList.remove('face-preview');
      document.querySelector('main').inert = false;
      if (currentScreen === 'pin') $('pin').focus({ preventScroll: true });
    };
    window.previewFaceId = () => {
      if (currentScreen !== 'pin' || pinUnlocking) return;
      clearTimeout(faceIdTimer);
      const overlay = $('faceIdOverlay');
      // Local demo only: simulate a scan and successful entry without biometric access.
      dismissWarning();
      overlay.classList.remove('success');
      overlay.querySelector('.face-id-caption').textContent = 'Сканирование…';
      overlay.inert = false;
      overlay.setAttribute('aria-hidden', 'false');
      overlay.classList.add('open');
      $('phone').classList.add('face-preview');
      document.querySelector('main').inert = true;
      overlay.tabIndex = -1;
      overlay.focus({ preventScroll: true });
      faceIdTimer = setTimeout(() => {
        overlay.classList.add('success');
        overlay.querySelector('.face-id-caption').textContent = 'Готово';
        faceIdTimer = setTimeout(() => {
          if (currentScreen === 'pin' && overlay.classList.contains('open')) navigate('home');
        }, 450);
      }, 900);
    };
    $('faceIdOverlay').addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); closeFaceIdPreview(); }
      if (event.key === 'Tab') { event.preventDefault(); $('faceIdOverlay').querySelector('button').focus(); }
    });

    function openCategory(title, context = 'services') {
      $('categoryTitle').textContent = title;
      const items = categoryContent[title] || [title];
      menuRows('categoryItems', items.map(item => [item, context === 'documents' ? 'file' : 'folder']), item => {
        if (item === 'Паспорт РФ') openPassport();
        else if (item === 'Сервисы и приложения') openCatalog();
        else service(item);
      });
      openScreen('categoryScreen');
    }
    function catalogApp(name) {
      const descriptions = {
        'Авто': 'Электронные документы и сервисы для автовладельцев',
        'Моя школа': 'Задания, уроки и оценки',
        'Госключ': 'Электронная подпись',
        'Культура': 'Кино, музеи и театры',
        'Карта болельщика': 'Билеты и карта болельщика'
      };
      modal(name, '<p>' + descriptions[name] + '</p><p>Открытие внешнего приложения пока недоступно.</p>');
    }
    function chooseRegion() {
      modal('Местоположение', '<p>Ваш регион</p><select class="region-input" id="regionChoice" aria-label="Регион"><option>Первоуральск г</option><option>Екатеринбург г</option><option>Москва г</option></select><button class="sheet-btn-primary" id="saveRegion">Выбрать</button>');
      $('saveRegion').onclick = () => {
        const city = $('regionChoice').value;
        const control = document.querySelector('.region-toolbar button');
        control.replaceChildren();
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.innerHTML = '<use href="#icon-location"/>';
        control.append(icon, document.createTextNode(city));
        document.querySelector('.region-card strong').textContent = city === 'Москва г' ? 'Москва' : 'Свердловская область';
        closeModal();
      };
    }
    function profileSetting(name) {
      if (name === 'Безопасность') {
        modal(name, '<p>Настройки экрана входа</p><button class="sheet-btn-primary" onclick="navigate(\'pin\')">Экран ввода кода</button><button class="sheet-btn-primary" onclick="replaySplash()">Экран загрузки</button>');
      } else if (name === 'Настройки уведомлений' || name === 'Настройки госпочты') {
        const key = name === 'Настройки уведомлений' ? 'push' : 'mail';
        modal(name, '<div class="setting-option"><span>' + (key === 'push' ? 'Показывать уведомления' : 'Показывать госпочту') + '</span><button class="switch-control" id="settingSwitch" aria-label="' + name + '" aria-pressed="' + localSettings[key] + '"><span></span></button></div>');
        $('settingSwitch').onclick = () => { localSettings[key] = !localSettings[key]; $('settingSwitch').setAttribute('aria-pressed', String(localSettings[key])); };
      } else if (name === 'Тема оформления') {
        modal(name, '<p>Тёмная тема, как на предоставленных скриншотах.</p><button class="sheet-btn-primary" onclick="closeModal()">Готово</button>');
      } else if (name === 'О приложении') {
        modal(name, '<p><strong>Госуслуги</strong></p><p>Версия 6.24.1 (сборка 1420)</p><p>Министерство цифрового развития, связи и массовых коммуникаций Российской Федерации</p>');
      } else if (name === 'Помощь и поддержка') {
        modal(name, '<p><strong>Служба поддержки Госуслуг</strong></p><p>Бесплатный номер по России: 8 800 100-70-10</p><p>Для звонков из-за границы: +7 495 727-47-47</p>');
      } else if (name === 'Отделения и МФЦ') {
        openCategory(name);
      } else service(name);
    }

    function setPaymentTab(historyTab) {
      $('paymentsScreen').classList.toggle('is-history', historyTab);
      $('paymentsDueTab').setAttribute('aria-selected', String(!historyTab));
      $('paymentsHistoryTab').setAttribute('aria-selected', String(historyTab));
      $('paymentEmptyTitle').textContent = historyTab ? 'Пока здесь ничего нет' : 'Ничего не найдено';
      $('paymentEmptyText').innerHTML = historyTab ? 'Тут будет отображаться информация о<br>совершённых вами платежах через Госуслуги' : 'Возможно недостаточно данных для поиска<br>штрафов и задолженностей';
      $('paymentEmptyActions').hidden = historyTab;
      $('paymentEmptyActions').style.display = historyTab ? 'none' : 'flex';
      document.querySelector('.payments-data').hidden = historyTab;
    }
    function paymentData() {
      modal('Данные для поиска начислений', '<div class="detail-row"><span>ФИО</span><span>Тимофеев Димитрий Александрович</span></div><div class="detail-row"><span>Дата рождения</span><span>02.10.2008</span></div><p>Поиск начислений пока недоступен.</p><button class="sheet-btn-primary" onclick="openPassportDetails()">Паспорт РФ</button>');
    }
    function paymentByDetails() {
      modal('Оплата по реквизитам или QR-коду', '<p>Оплата пока недоступна.</p><button class="sheet-btn-primary" onclick="closeModal()">Понятно</button>');
    }
    function passportActions() {
      modal('Паспорт РФ', '<button class="sheet-btn-primary" onclick="copyAllPassportData()">Скопировать все данные</button><button class="sheet-btn-primary" onclick="shareDocument()">Поделиться данными</button>');
    }

    function newsBanner(orange) {
      const button = document.createElement('button');
      button.className = 'news-banner' + (orange ? ' orange-banner' : '');
      button.innerHTML = '<strong>' + (orange ? 'Госуслуги для новых регионов' : 'Меры поддержки<br>для защитников Отечества') + '</strong><svg viewBox="0 0 64 64" aria-hidden="true"><path d="m30 4 8 18 22 1-17 14 6 22-19-12-19 12 6-22L1 23l22-1z"/><path d="m4 40-3 19 16-4M47 17l14-7v24l-9 4"/></svg>';
      button.onclick = () => service(orange ? 'Госуслуги для новых регионов' : 'Меры поддержки для защитников Отечества');
      return button;
    }
    function renderNotifications() {
      $('unreadCount').textContent = unreadTotal;
      $('phone').classList.toggle('notifications-read', unreadTotal === 0);
      $('notificationsTitle').textContent = notificationArchive ? 'Архив' : 'Уведомления';
      document.querySelector('#notificationsScreen .toolbar-link').textContent = notificationArchive ? 'назад' : 'архив';
      for (const [id, filter] of [['unreadFilter', 'unread'], ['applicationsFilter', 'applications'], ['appointmentsFilter', 'appointments']]) $(id).setAttribute('aria-pressed', String(notificationFilter === filter));
      const list = $('notificationItems');
      list.replaceChildren();
      let visible = notificationData.map((item, index) => ({ ...item, index }));
      if (notificationArchive) visible = [];
      if (notificationFilter === 'unread') visible = visible.filter(item => !item.read);
      if (['applications', 'appointments'].includes(notificationFilter)) visible = [];
      if (!visible.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-section';
        empty.textContent = notificationArchive ? 'В архиве пока ничего нет' : notificationFilter === 'applications' ? 'Заявлений пока нет' : notificationFilter === 'appointments' ? 'Записей на приём пока нет' : 'Непрочитанных уведомлений нет';
        list.append(empty);
        return;
      }
      visible.forEach((item, visibleIndex) => {
        const button = document.createElement('button');
        button.className = 'notification-row' + (item.read ? ' is-read' : '') + (item.type === 'госпочта' ? ' birthday' : '');
        button.innerHTML = '<span class="notification-metadata"><span>' + item.type + '</span><span>' + item.date + '</span></span><span class="notification-row-title"><strong></strong><svg aria-hidden="true"><use href="#next"/></svg></span><span class="notification-source">' + (item.medical ? '<span class="medical-dot"></span>' : '') + item.source + '</span>';
        button.querySelector('strong').textContent = item.title;
        button.onclick = () => openNotification(item.index);
        list.append(button);
        if (visibleIndex === 2) list.append(newsBanner(false));
        if (visibleIndex === 7) list.append(newsBanner(true));
      });
    }
    function openNotification(index) {
      const item = notificationData[index];
      if (!item.read) { item.read = true; unreadTotal = Math.max(0, unreadTotal - 1); }
      const article = $('notificationArticle');
      article.innerHTML = '<span class="notification-metadata"></span><h1></h1><p></p>';
      article.querySelector('span').textContent = item.type + ' · ' + item.date;
      article.querySelector('h1').textContent = item.title;
      article.querySelector('p').textContent = item.text;
      renderNotifications();
      openScreen('notificationDetail');
    }
    function setNotificationFilter(filter) { notificationFilter = notificationFilter === filter ? 'all' : filter; renderNotifications(); }
    function toggleNotificationArchive() { notificationArchive = !notificationArchive; renderNotifications(); }
    function markAllRead() { notificationData.forEach(item => item.read = true); unreadTotal = 0; renderNotifications(); showToast('Все уведомления прочитаны'); }

    function assistantInformation() {
      modal('Робот Макс', '<p>Умный цифровой помощник Госуслуг. Отвечает на вопросы, помогает найти услуги и получить необходимые справки.</p>');
    }
    function toggleAssistantMode() {
      const control = $('assistantModeSwitch');
      const enabled = control.getAttribute('aria-pressed') !== 'true';
      control.setAttribute('aria-pressed', String(enabled));
      showToast(enabled ? 'Умный режим включён' : 'Стандартный режим');
    }
    function sendAssistantMessage(message) {
      const text = String(message).trim().slice(0, 1000);
      if (!text) return;
      const list = $('assistantMessages');
      const outgoing = document.createElement('div');
      outgoing.className = 'chat-message user-message';
      outgoing.textContent = text;
      list.append(outgoing);
      const reply = document.createElement('div');
      reply.className = 'chat-message assistant-message';
      const query = text.toLowerCase();
      if (query.includes('паспорт') || query.includes('документ')) {
        reply.textContent = 'Документы доступны в соответствующем разделе.';
        const action = document.createElement('button');
        action.className = 'sheet-btn-primary';
        action.textContent = 'Показать паспорт';
        action.onclick = openPassport;
        reply.append(action);
      } else if (query.includes('врач') || query.includes('здоров')) {
        reply.textContent = 'Откройте раздел «Здоровье», чтобы посмотреть доступные услуги.';
      } else if (query.includes('привет')) reply.textContent = 'Здравствуйте, Димитрий! Здесь доступны документы, услуги и уведомления.';
      else reply.textContent = 'Попробуйте задать вопрос иначе';
      list.append(reply);
      $('assistantInput').value = '';
      requestAnimationFrame(() => list.scrollTo({ top: list.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
    }

    menuRows('serviceCategories', serviceGroups, title => openCategory(title));
    menuRows('documentCategories', documentGroups, title => openCategory(title, 'documents'));
    menuRows('profileSettings', profileGroups, profileSetting);
    names.push(...serviceGroups.map(([name]) => name).filter(name => !names.includes(name)));
    renderNotifications();

    const markAllButton = document.createElement('button');
    markAllButton.className = 'mark-all-control';
    markAllButton.textContent = 'отметить все как прочитанные';
    markAllButton.style.display = 'none';
    markAllButton.onclick = markAllRead;
    $('phone').append(markAllButton);
    window.updateScreenChrome = id => {
      $('phone').classList.toggle('profile-scrolled', id === 'profileScreen' && $('profileScreen').scrollTop > 8);
      markAllButton.style.display = id === 'notificationsScreen' ? 'block' : 'none';
      markAllButton.inert = id !== 'notificationsScreen';
      if (id === 'assistantScreen') requestAnimationFrame(() => $('assistantMessages').scrollTo({ top: 0 }));
    };
    $('profileScreen').addEventListener('scroll', () => {
      const scrolled = $('profileScreen').scrollTop > 8;
      $('profileScreen').classList.toggle('is-scrolled', scrolled);
      if (currentScreen === 'profileScreen') $('phone').classList.toggle('profile-scrolled', scrolled);
    }, { passive: true });

    $('assistantForm').addEventListener('submit', event => { event.preventDefault(); sendAssistantMessage($('assistantInput').value); });
    $('documentAttachment').addEventListener('change', event => {
      for (const file of event.target.files) {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') { showToast('Выберите изображение или PDF'); continue; }
        if (file.size > 15 * 1024 * 1024) { showToast('Файл должен быть меньше 15 МБ'); continue; }
        const url = URL.createObjectURL(file);
        attachmentUrls.add(url);
        const row = document.createElement('div');
        row.className = 'attachment-row';
        if (file.type.startsWith('image/')) { const thumb = document.createElement('img'); thumb.src = url; thumb.alt = ''; row.append(thumb); }
        const link = document.createElement('a');
        link.href = url; link.textContent = file.name; link.target = '_blank'; link.rel = 'noopener';
        const remove = document.createElement('button');
        remove.textContent = '×'; remove.setAttribute('aria-label', 'Удалить файл ' + file.name);
        remove.onclick = () => { URL.revokeObjectURL(url); attachmentUrls.delete(url); row.remove(); };
        row.append(link, remove); $('attachmentList').append(row);
      }
      event.target.value = '';
    });
    window.addEventListener('pagehide', () => attachmentUrls.forEach(url => URL.revokeObjectURL(url)));

    const homeServices = document.querySelectorAll('#home .dashboard-panel')[1];
    homeServices.querySelector('.grid-item:last-child').onclick = openCatalog;
    document.querySelector('#home .balance-card').onclick = payments;
    const headerTools = document.querySelector('.home-header .headtools');
    headerTools.querySelector('.goskan-badge').setAttribute('aria-label', 'Госкан');
    const carousel = document.querySelector('.stories-row');
    const moreStoryAssets = ['storyBusiness', 'storyAccount', 'storyCar', 'storySchool', 'storyTaxi'];
    const moreStoryTitles = ['Начните бизнес онлайн', 'Защитите учётную запись', 'Сообщить о проблеме с авто', 'Госуслуги Моя школа', 'Проверка легкового такси'];
    const storySources = REFERENCE_STORY_ASSETS;
    carousel.querySelectorAll('img')[3].src = storySources.storyRent;
    moreStoryAssets.forEach((asset, index) => {
      const card = document.createElement('button');
      card.className = 'story-card';
      const image = document.createElement('img'); image.src = storySources[asset]; image.alt = moreStoryTitles[index];
      card.append(image);
      card.onclick = () => { card.classList.add('seen'); service(moreStoryTitles[index]); };
      carousel.append(card);
    });
    const euro = document.createElement('button');
    euro.className = 'story-card';
    euro.innerHTML = '<span class="vector-story"><svg viewBox="0 0 80 80" aria-hidden="true"><path d="M40 6 75 68H5Z" fill="#ecebf2" stroke="#373b43" stroke-width="5"/><path d="M40 17 65 61H15Z" fill="#ec898e" stroke="none"/><path d="M40 28 55 55H25Z" fill="#444b5b" stroke="none"/></svg>Европротокол<br>онлайн</span>';
    euro.onclick = () => service('Европротокол онлайн');
    carousel.append(euro);
    const extraChips = ['Субсидии ЖКХ', 'Водительские права', 'Запись в школу'];
    document.querySelector('.chips-row button:last-child').textContent = extraChips[0];
    for (const label of extraChips.slice(1)) { const chip = document.createElement('button'); chip.textContent = label; chip.onclick = () => service(label); document.querySelector('.chips-row').append(chip); }

    const standaloneApp = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
    const nativeDevice = navigator.standalone === true || /Android|iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || (navigator.maxTouchPoints > 0 && matchMedia('(any-pointer: coarse)').matches);
    document.body.classList.toggle('native-device', nativeDevice);
    document.body.classList.toggle('standalone-app', standaloneApp);
    document.documentElement.classList.toggle('standalone-app', standaloneApp);
    const iosHomeApp = standaloneApp && (navigator.standalone === true || /iPhone|iPad|iPod/.test(navigator.userAgent));
    function updateStandaloneHeight() {
      if (!iosHomeApp) return;
      const root = document.documentElement;
      const style = getComputedStyle(root);
      const safeTop = parseFloat(style.getPropertyValue('--device-safe-top')) || 0;
      const safeBottom = parseFloat(style.getPropertyValue('--device-safe-bottom')) || 0;
      const fullHeight = Math.abs(innerWidth - screen.width) <= 2 ? screen.height
        : Math.abs(innerWidth - screen.height) <= 2 ? screen.width : 0;
      const availableHeight = innerHeight;
      // WebKit can exclude the status bar from both CSS viewport height and inset:0.
      // Use the screen size only for a full-width home-screen window drawing under that bar.
      if (safeTop > 0 && fullHeight >= availableHeight && fullHeight - availableHeight <= safeTop + safeBottom + 8) {
        root.style.setProperty('--standalone-height', fullHeight + 'px');
      } else root.style.removeProperty('--standalone-height');
    }
    updateStandaloneHeight();
    function updateDeviceTime() { const date = new Date(); $('deviceTime').textContent = date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0'); }
    updateDeviceTime();
    setInterval(updateDeviceTime, 30000);
    let viewportFrame = 0;
    let tallestViewport = Math.max(window.visualViewport?.height || 0, innerHeight);
    let viewportWidth = innerWidth;
    function resizeForKeyboard() {
      cancelAnimationFrame(viewportFrame);
      viewportFrame = requestAnimationFrame(() => {
        const viewport = window.visualViewport;
        if (!nativeDevice || (viewport && Math.abs(viewport.scale - 1) > .01)) return;
        const height = viewport?.height || innerHeight;
        if (Math.abs(innerWidth - viewportWidth) > 40) { tallestViewport = Math.max(height, innerHeight); viewportWidth = innerWidth; }
        tallestViewport = Math.max(tallestViewport, height, innerHeight);
        const editing = document.activeElement?.matches('input:not([type="file"]), textarea');
        const keyboard = Boolean(editing && tallestViewport - height > 100);
        const changed = $('phone').classList.contains('keyboard-open') !== keyboard;
        $('phone').classList.toggle('keyboard-open', keyboard);
        if (standaloneApp && !keyboard) updateStandaloneHeight();
        // iOS can retain a shorter visual viewport after the keyboard or app switch.
        // Outside keyboard input, a home-screen app fills its CSS viewport instead.
        if (standaloneApp && !keyboard) $('phone').style.removeProperty('--viewport-height');
        else $('phone').style.setProperty('--viewport-height', Math.floor(height) + 'px');
        // Only keyboard panning moves the shell; ordinary app scrolling keeps it anchored.
        $('phone').style.setProperty('--viewport-top', (keyboard ? viewport?.offsetTop || 0 : 0) + 'px');
        if (keyboard && changed && currentScreen === 'assistantScreen') $('assistantMessages').scrollTop = $('assistantMessages').scrollHeight;
      });
    }
    window.visualViewport?.addEventListener('resize', resizeForKeyboard);
    window.visualViewport?.addEventListener('scroll', resizeForKeyboard);
    window.addEventListener('resize', resizeForKeyboard);
    window.addEventListener('pageshow', resizeForKeyboard);
    document.addEventListener('focusin', resizeForKeyboard);
    document.addEventListener('focusout', resizeForKeyboard);
    window.addEventListener('orientationchange', () => setTimeout(resizeForKeyboard, 200));
    resizeForKeyboard();

    let checkingAppVersion = false;
    async function refreshInstalledApp() {
      if (!standaloneApp || checkingAppVersion || document.visibilityState === 'hidden') return;
      checkingAppVersion = true;
      try {
        const versionUrl = new URL('app-version.json', document.baseURI);
        versionUrl.searchParams.set('t', String(Date.now()));
        const response = await fetch(versionUrl, { cache: 'no-store' });
        if (!response.ok) return;
        const { revision } = await response.json();
        const current = document.querySelector('meta[name="app-revision"]')?.content;
        const url = new URL(location.href);
        if (!/^[a-f0-9]{12}$/.test(revision) || !current || revision === current || url.searchParams.get('v') === revision) return;
        // Preserve a session while typing or attaching files; update on the next app launch.
        if (document.activeElement?.matches('input, textarea') || attachmentUrls.size) return;
        url.searchParams.set('v', revision);
        location.replace(url.href);
      } catch {
        // Offline launches keep the current screen usable.
      } finally {
        checkingAppVersion = false;
      }
    }
    window.addEventListener('pageshow', refreshInstalledApp);
    document.addEventListener('visibilitychange', refreshInstalledApp);
    refreshInstalledApp();

    // Animate the screen layers together; retain their position on quick reversals.
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    const runningMotion = new Set();
    function stopScreenMotion() {
      for (const record of [...runningMotion]) record.animation.cancel();
    }
    function playMotion(element, frames, options, className) {
      if (className) element.classList.add(className);
      const animation = element.animate(frames, options);
      const record = { animation, element };
      runningMotion.add(record);
      const clean = () => {
        animation.onfinish = animation.oncancel = null;
        if (className) element.classList.remove(className, 'motion-back');
        runningMotion.delete(record);
        animation.cancel();
      };
      animation.onfinish = animation.oncancel = clean;
      return animation;
    }
    window.animateScreenChange = (previous, next, direction) => {
      const positions = new Map([...runningMotion].map(({ element }) => {
        const style = getComputedStyle(element);
        return [element, { transform: style.transform, opacity: style.opacity }];
      }));
      stopScreenMotion();
      if (previous === next || motionPreference.matches || !Element.prototype.animate) return;
      const incoming = $(next), outgoing = $(previous);
      const options = { duration: 320, easing: 'cubic-bezier(.25, .8, .25, 1)', fill: 'both' };
      let start = { transform: 'translate3d(100%,0,0)', opacity: 1 };
      let end = { transform: 'translate3d(-25%,0,0)', opacity: 1 };
      if (direction === 'back') {
        start = { transform: 'translate3d(-25%,0,0)', opacity: 1 };
        end = { transform: 'translate3d(100%,0,0)', opacity: 1 };
      } else if (direction === 'tab' || ['splash','pin'].includes(previous) || ['splash','pin'].includes(next)) {
        start = { transform: 'translate3d(0,0,0)', opacity: 0 };
        end = { transform: 'translate3d(0,0,0)', opacity: 0 };
        options.duration = 200;
      }
      if (next === 'catalogScreen') start = { transform: 'translate3d(0,100%,0)', opacity: 1 };
      if (previous === 'catalogScreen') { start = { transform: 'translate3d(0,-8px,0)', opacity: .8 }; end = { transform: 'translate3d(0,100%,0)', opacity: 1 }; }
      const rest = { transform: 'translate3d(0,0,0)', opacity: 1 };
      if (outgoing) playMotion(outgoing, [positions.get(outgoing) || rest, end], options, 'motion-out');
      playMotion(incoming, [positions.get(incoming) || start, rest], options, 'motion-in');
      incoming.classList.toggle('motion-back', direction === 'back');
    };
    motionPreference.addEventListener?.('change', stopScreenMotion);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopScreenMotion(); });

    let edgeGesture = null;
    document.querySelector('main').addEventListener('pointerdown', event => {
      const screen = event.target.closest('.screen.active');
      if (!screen || screen.classList.contains('tab-screen') || ['splash','pin','document'].includes(screen.id) || $('phone').classList.contains('modal-open')) return;
      if (event.clientX - $('phone').getBoundingClientRect().left <= 28) edgeGesture = { x: event.clientX, y: event.clientY, screen: screen.id };
    }, { passive: true });
    document.querySelector('main').addEventListener('pointerup', event => {
      const gesture = edgeGesture; edgeGesture = null;
      if (gesture && gesture.screen === currentScreen && event.clientX - gesture.x > 72 && Math.abs(event.clientY - gesture.y) < 55) goBack();
    }, { passive: true });
    document.querySelector('main').addEventListener('pointercancel', () => edgeGesture = null);

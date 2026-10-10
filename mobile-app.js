    // Additional screens from the supplied reference archive. All state stays
    // in this browser session; there are no government or payment requests.
    const serviceGroups = [
      ['Популярные услуги', 'heart'], ['Здоровье', 'health'], ['Справки Выписки', 'folder'],
      ['Пенсии Пособия', 'pension'], ['Транспорт Права', 'car'], ['Семья', 'family'],
      ['Образование', 'book'], ['Регистрация Паспорт', 'passport'], ['Штрафы Налоги', 'ruble'],
      ['Земля Дом', 'home-icon'], ['Прочее', 'grid'], ['Ведомства', 'permit']
    ];
    const documentGroups = [
      ['Личные документы', 'passport'], ['Семья и дети', 'family'], ['Транспорт', 'car'],
      ['Здоровье', 'health'], ['Недвижимость', 'home-icon'], ['Работа и пенсия', 'sign'],
      ['Образование', 'book'], ['Льготы и выплаты', 'pension'], ['Доходы и налоги', 'ruble'],
      ['Нотариальные документы', 'file'], ['Правопорядок', 'justice'], ['Интеллектуальные права', 'check'],
      ['Карта болельщика Билеты', 'card'], ['Оружие', 'permit'], ['Цифровой архив', 'archive']
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
      { type: 'новости', date: '26.09 в 04:05', title: 'Поддержите сборную России по футболу', source: 'Госуслуги', text: 'Новость показана как пример уведомления в интерактивном макете.' },
      { type: 'документы', date: '19.09 в 04:49', title: 'Протоколы консультаций', source: 'Добавлен новый медицинский документ', medical: true, text: 'В макете нет медицинских записей. Это пример карточки уведомления.' },
      { type: 'документы', date: '18.09 в 18:26', title: 'Протоколы консультаций', source: 'Добавлен новый медицинский документ', medical: true, text: 'В макете нет медицинских записей. Это пример карточки уведомления.' },
      { type: 'новости', date: '30.07 в 14:53', title: 'Опрос по подготовке к ЕГЭ', source: 'Госуслуги', text: 'Пример новости об образовании.' },
      { type: 'новости', date: '28.07 в 09:54', title: 'Сохраните безопасный доступ к важным сайтам', source: 'Госуслуги', text: 'Пример информационного уведомления.' },
      { type: 'новости', date: '24.07 в 17:08', title: 'Стартует Чемпионат болельщиков', source: 'Госуслуги', text: 'Пример новости для болельщиков.' },
      { type: 'новости', date: '09.07 в 00:01', title: 'Заселитесь в отель без паспорта', source: 'Госуслуги', text: 'Демонстрационный информационный материал.' },
      { type: 'новости', date: '07.07 в 20:57', title: 'Воспользуйтесь сервисом подбора колледжей', source: 'Госуслуги', text: 'Пример новости о поступлении в колледж.' }
    ].map(item => ({ ...item, read: false }));

    function uiIcon(name, className = '') {
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
      navigate(id);
      history.replaceState({ screen: id }, '');
    }
    function goBack() {
      if (history.state?.screen === currentScreen && !['home', 'pin', 'splash'].includes(currentScreen)) history.back();
      else navigate(uiParents[currentScreen] || 'home');
    }
    function services() { openTab('servicesScreen'); }
    function documents() { openTab('documentsScreen'); }
    function payments() { openTab('paymentsScreen'); }
    function showProfile() { openScreen('profileScreen'); }
    function openAssistant() { openScreen('assistantScreen'); }
    function openPassportDetails() { openScreen('passportDetails'); }
    function openCatalog() { openScreen('catalogScreen'); }
    function openNotifications() { openScreen('notificationsScreen'); }

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
      modal(name, '<p>' + descriptions[name] + '</p><p>Демонстрационный раздел. Внешние приложения в этом макете не подключены.</p>');
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
        modal(name, '<p>Настройки экрана входа в макет</p><button class="sheet-btn-primary" onclick="navigate(\'pin\')">Экран ввода кода</button><button class="sheet-btn-primary" onclick="replaySplash()">Экран загрузки</button>');
      } else if (name === 'Настройки уведомлений' || name === 'Настройки госпочты') {
        const key = name === 'Настройки уведомлений' ? 'push' : 'mail';
        modal(name, '<div class="setting-option"><span>' + (key === 'push' ? 'Показывать уведомления' : 'Показывать госпочту') + '</span><button class="switch-control" id="settingSwitch" aria-label="' + name + '" aria-pressed="' + localSettings[key] + '"><span></span></button></div>');
        $('settingSwitch').onclick = () => { localSettings[key] = !localSettings[key]; $('settingSwitch').setAttribute('aria-pressed', String(localSettings[key])); };
      } else if (name === 'Тема оформления') {
        modal(name, '<p>Тёмная тема, как на предоставленных скриншотах.</p><button class="sheet-btn-primary" onclick="closeModal()">Готово</button>');
      } else if (name === 'О приложении' || name === 'Помощь и поддержка') {
        modal(name, '<p>Госуслуги · интерактивный мобильный макет</p><p>Демонстрационный проект. Цифры кода, сообщения и выбранные файлы не отправляются на сервер.</p><p><a style="color:#008dff" href="https://github.com/iq28qi/gosuslugi-mobile-mockup" target="_blank" rel="noopener">Исходный код проекта</a></p>');
      } else if (name === 'Отделения и МФЦ') {
        openCategory(name);
      } else service(name);
    }

    function setPaymentTab(historyTab) {
      $('paymentsDueTab').setAttribute('aria-selected', String(!historyTab));
      $('paymentsHistoryTab').setAttribute('aria-selected', String(historyTab));
      $('paymentEmptyTitle').textContent = historyTab ? 'Пока здесь ничего нет' : 'Ничего не найдено';
      $('paymentEmptyText').innerHTML = historyTab ? 'Тут будет отображаться информация о<br>совершённых вами платежах через Госуслуги' : 'Возможно недостаточно данных для поиска<br>штрафов и задолженностей';
      $('paymentEmptyActions').hidden = historyTab;
      $('paymentEmptyActions').style.display = historyTab ? 'none' : 'flex';
      document.querySelector('.payments-data').hidden = historyTab;
    }
    function paymentData() {
      modal('Данные для поиска начислений', '<div class="detail-row"><span>ФИО</span><span>Тимофеев Димитрий Александрович</span></div><div class="detail-row"><span>Дата рождения</span><span>02.10.2008</span></div><p>Макет. Поиск реальных задолженностей не выполняется.</p><button class="sheet-btn-primary" onclick="openPassportDetails()">Паспорт РФ</button>');
    }
    function paymentByDetails() {
      modal('Оплата по реквизитам или QR-коду', '<p>Это демонстрационный экран. Платежи в макете не выполняются.</p><button class="sheet-btn-primary" onclick="closeModal()">Понятно</button>');
    }
    function passportActions() {
      modal('Паспорт РФ', '<button class="sheet-btn-primary" onclick="copyAllPassportData()">Скопировать все данные</button><button class="sheet-btn-primary" onclick="shareDocument()">Поделиться данными макета</button>');
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
      article.innerHTML = '<span class="notification-metadata"></span><h1></h1><p></p><p class="mockup-note">Демонстрационное уведомление</p>';
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
      modal('Робот Макс', '<p>Локальный демонстрационный чат. Сообщения не отправляются на сервер. GPT и государственные сервисы не подключены.</p>');
    }
    function toggleAssistantMode() {
      const control = $('assistantModeSwitch');
      control.setAttribute('aria-pressed', String(control.getAttribute('aria-pressed') !== 'true'));
      showToast('Демонстрационный режим');
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
        reply.textContent = 'Откройте раздел «Здоровье», чтобы посмотреть доступные услуги макета.';
      } else if (query.includes('привет')) reply.textContent = 'Здравствуйте, Димитрий! В макете доступны документы, услуги и уведомления.';
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
      markAllButton.style.display = id === 'notificationsScreen' ? 'block' : 'none';
      markAllButton.inert = id !== 'notificationsScreen';
      if (id === 'assistantScreen') requestAnimationFrame(() => $('assistantMessages').scrollTo({ top: 0 }));
    };

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

    const nativeDevice = /Android|iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    document.body.classList.toggle('native-device', nativeDevice);
    function updateDeviceTime() { const date = new Date(); $('deviceTime').textContent = date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0'); }
    updateDeviceTime();
    setInterval(updateDeviceTime, 30000);
    function resizeForKeyboard() {
      if (nativeDevice && window.visualViewport?.scale === 1) {
        $('phone').style.height = window.visualViewport.height + 'px';
        $('assistantMessages').scrollTop = $('assistantMessages').scrollHeight;
      }
    }
    window.visualViewport?.addEventListener('resize', resizeForKeyboard);
    window.addEventListener('orientationchange', () => setTimeout(resizeForKeyboard, 200));
    resizeForKeyboard();

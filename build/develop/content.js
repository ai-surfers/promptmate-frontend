/*global chrome */

const url = window.location.hostname;
const allowedSites = ['chatgpt.com', 'claude.ai', 'gemini.google.com', 'www.perplexity.ai'];

if (allowedSites.includes(url)) {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = chrome.runtime.getURL('style.css');
	document.head.appendChild(link);

	// Floating Button 추가
	const buttonContainer = document.createElement('div');
	buttonContainer.id = 'float-btn';

	const img = document.createElement('img');
	img.src = chrome.runtime.getURL('images/logo_icon.png');
	buttonContainer.appendChild(img);

	const span = document.createElement('span');
	span.innerText = '⌘P';
	buttonContainer.appendChild(span);

	// Close Button 추가
	const closeButton = document.createElement('div');
	closeButton.id = 'close-btn';
	closeButton.innerHTML = `
  <div class="close-icon" style="width: 16px; height: 16px; border-radius: 50%;">
    <img src="${chrome.runtime.getURL(
			'images/icon_close.svg'
		)}" alt="close-icon" style="width: 100%; height: 100%;">
  </div>
`;
	buttonContainer.appendChild(closeButton);

	closeButton.addEventListener('mouseout', (e) => {
		buttonContainer.classList.remove('hover');
	});

	closeButton.addEventListener('mouseover', (e) => {
		buttonContainer.classList.add('hover');
	});

	closeButton.addEventListener('click', (e) => {
		e.stopPropagation();

		if (!hideMenu()) showHideMenu();
	});

	document.body.appendChild(buttonContainer);

	/**
	 * x 버튼 관련 로직
	 */
	function hideMenu() {
		let menu = document.getElementById('hide-menu');
		if (menu) {
			menu.remove();
			return true;
		}

		return false;
	}

	function showHideMenu() {
		let menu = document.createElement('div');
		menu.id = 'hide-menu';
		menu.innerHTML = `
        <ul>
            <li id="hide-next-visit">다음 방문 때까지 숨기기</li>
            <li id="disable-this-site">이 사이트에 대해 비활성화</li>
            <li id="disable-everywhere">전역적으로 비활성화</li>
        </ul>
    `;
		document.body.appendChild(menu);

		const buttonRect = buttonContainer.getBoundingClientRect();
		const menuHeight = menu.offsetHeight;
		const viewportHeight = window.innerHeight;

		let topPosition = buttonRect.bottom + window.scrollY;
		let bottomPosition = buttonRect.top + window.scrollY - menuHeight;

		// 메뉴가 화면 아래를 벗어나는지 체크
		if (topPosition + menuHeight > viewportHeight) {
			if (bottomPosition < 0) {
				topPosition = 0;
			} else {
				topPosition = bottomPosition;
			}
		}

		menu.style.position = 'absolute';
		menu.style.top = `${topPosition}px`;
		menu.style.right = `10px`;

		// Add event listeners for each menu option
		document.getElementById('hide-next-visit').addEventListener('click', () => {
			chrome.storage.local.set({ hideButtonUntilNextVisit: true });
			hideButton();
		});

		document.getElementById('disable-this-site').addEventListener('click', () => {
			const currentSite = window.location.hostname;
			chrome.storage.local.get({ disabledSites: [] }, (result) => {
				const disabledSites = result.disabledSites || [];
				disabledSites.push(currentSite);
				chrome.storage.local.set({ disabledSites });
				hideButton();
			});
		});

		document.getElementById('disable-everywhere').addEventListener('click', () => {
			chrome.storage.local.set({ hideButtonGlobally: true });
			hideButton();
		});

		// 메뉴 외부 클릭 시 메뉴 닫기
		document.addEventListener(
			'click',
			function closeMenuOnClickOutside(event) {
				if (!menu.contains(event.target) && !closeButton.contains(event.target)) {
					menu.remove();
					document.removeEventListener('click', closeMenuOnClickOutside); // 이벤트 리스너 제거
				}
			},
			true
		);
	}

	function hideButton() {
		buttonContainer.style.display = 'none';
		const menu = document.getElementById('hide-menu');
		if (menu) menu.remove();
	}

	// On page load, check if the button should be hidden
	chrome.storage.local.get(
		['hideButtonUntilNextVisit', 'disabledSites', 'hideButtonGlobally', 'buttonClientY'],
		(result) => {
			const { hideButtonUntilNextVisit, disabledSites, hideButtonGlobally, buttonClientY } = result;
			const currentSite = window.location.hostname;

			if (hideButtonGlobally) {
				hideButton();
			} else if (disabledSites && disabledSites.includes(currentSite)) {
				hideButton();
			} else if (hideButtonUntilNextVisit) {
				hideButton();
				// Reset for the next visit
				chrome.storage.local.set({ hideButtonUntilNextVisit: false });
			}

			// 버튼 위치 복원
			if (buttonClientY) {
				updateButtonPosition(buttonClientY);
			}
		}
	);

	/**
	 * 버튼 드래그 로직
	 */

	var offsetY = 0;
	var button = document.getElementById('float-btn');
	var isDragging = false;
	var containerHeight = window.innerHeight;
	var animationFrameId = null;

	function updateButtonPosition(clientY) {
		var newBottom = containerHeight - clientY - offsetY;

		// 바운더리 설정 (최소 20px, 최대 window height - button height - 20)
		var minBottom = 20;
		var maxBottom = containerHeight - button.offsetHeight - 20;
		newBottom = Math.max(minBottom, Math.min(newBottom, maxBottom));

		button.style.transform = `translateY(${-newBottom}px)`;
		chrome.storage.local.set({ buttonClientY: clientY });
	}

	// 240929 close 버튼 숨김
	// button.addEventListener("mouseover", () => {
	//     closeButton.style.display = "block";
	// });

	// button.addEventListener("mouseout", () => {
	//     closeButton.style.display = "none";
	// });

	button.addEventListener('click', () => {
		hideMenu();

		if (!isDragging) {
			chrome.runtime.sendMessage({ action: 'clickSidePanel' });
		}
	});

	button.addEventListener(
		'mousedown',
		(e) => {
			isDragging = true;
			offsetY = button.getBoundingClientRect().bottom - e.clientY;
			buttonContainer.classList.add('dragging');
			buttonContainer.style.transition = 'none';
		},
		true
	);

	document.addEventListener(
		'mouseup',
		() => {
			isDragging = false;
			buttonContainer.classList.remove('dragging');
			buttonContainer.style.transition = 'all 0.3s ease';

			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
				animationFrameId = null;
			}
		},
		true
	);

	document.addEventListener(
		'mousemove',
		(e) => {
			e.preventDefault();
			if (!isDragging) return;

			// 기존 애니메이션 프레임이 있으면 취소
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}

			// requestAnimationFrame으로 화면 업데이트 요청
			animationFrameId = requestAnimationFrame(() => updateButtonPosition(e.clientY));
		},
		true
	);

	/**
	 * 이벤트 리스너
	 */
	// [메시지 수신 Listener]
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		console.log('[Content] Message received', request, sender);
	});
}

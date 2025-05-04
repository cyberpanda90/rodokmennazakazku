class MimeDOM {
	static replaceText(target, text) {
		const element = document.querySelector(target)
		if (!element) return

		element.textContent = text
	}

	static copyElementToElement(source, target) {
		const sourceEl = document.querySelector(source)
		const targetEl = document.querySelector(target)

		if (!sourceEl || !targetEl) return

		const clone = sourceEl.cloneNode(true)
		targetEl.appendChild(clone)
	}

	static moveElementToElement(source, target) {
		const sourceEl = document.querySelector(source)
		const targetEl = document.querySelector(target)

		if (!sourceEl || !targetEl) return

		targetEl.appendChild(sourceEl)
	}

	static createElementWithClass(type, className) {
		const element = document.createElement(type)
		element.classList.add(className)

		return element
	}

	static runFunctionAfterElementExists(parent, selector, code) {
		const parentElement = document.querySelector(parent)
		console.log('parentElement', parentElement)
		if (!parentElement) return

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						if (node.matches(selector) || node.querySelector(selector)) {
							console.log('Element found:', node)
							code

							observer.disconnect()
						}
					}
				})
			})
		})

		observer.observe(parentElement, {
			childList: true,
			subtree: true,
		})
	}

	static createModal(id, className, title, text, bg = true) {
		const hasBg = bg

		if (hasBg) {
			const background = this.createElementWithClass('div', 'modal-background')
			document.body.appendChild(background)
		}

		const modal = this.createElementWithClass('div', 'modal')
		const wrapper = this.createElementWithClass('div', 'modal-content')
		const header = this.createElementWithClass('div', 'modal-header')
		const content = this.createElementWithClass('div', 'modal-text')
		const close = this.createElementWithClass('span', 'modal-close')

		modal.classList.add(className)
		modal.id = id

		header.textContent = title
		content.textContent = text

		close.textContent = '×'
		close.addEventListener('click', () => this.removeModal(id))

		wrapper.appendChild(header)
		wrapper.appendChild(content)
		wrapper.appendChild(close)

		modal.appendChild(wrapper)
		document.body.appendChild(modal)
	}

	static removeModal(id) {
		const modal = document.getElementById(id)
		if (modal) modal.remove()

		const background = document.querySelector('.modal-background')
		if (background) background.remove()
	}
}

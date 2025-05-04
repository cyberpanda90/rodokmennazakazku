class MimeMessage {
	// Replace text in message based on the original text
	static replaceText(original, newText) {
		const container = document.querySelector('.messages')
		if (!container) return

		const observer = new MutationObserver(() => {
			const messages = container.querySelectorAll('.msg')

			messages.forEach((message) => {
				const spanElement = message.querySelector('span')
				if (!spanElement) return

				if (spanElement.textContent.includes(original)) {
					if (newText.includes('<') && newText.includes('>')) {
						spanElement.innerHTML = newText
					} else {
						spanElement.textContent = newText
					}
				}
			})
		})

		observer.observe(container, { childList: true, subtree: true })
	}

	// Create a message with optional timeout
	static create(type, msg, id = null, timeout = null) {
		if (id) this.remove(id)

		const messages = document.querySelector('.messages')
		if (!messages) {
			const wrapper = MimeDOM.createElementWithClass('div', 'messages')
			document.body.appendChild(wrapper)
		}

		const message = MimeDOM.createElementWithClass('div', 'msg')
		message.classList.add(`msg-${type}`)
		message.setAttribute('role', 'alert')

		const container = MimeDOM.createElementWithClass('div', 'container')
		const span = MimeDOM.createElementWithClass('span', 'notifierMessage')
		span.textContent = msg

		container.appendChild(span)
		message.appendChild(container)

		if (id) message.id = id

		messages.appendChild(message)

		// Automatically remove message after timeout if specified
		if (timeout) {
			setTimeout(() => {
				this.removeByElement(message)
			}, timeout)
		}
	}

	// Remove a message by ID
	static remove(id) {
		const messages = document.querySelector('.messages')
		if (!messages) return

		const message = messages.querySelector(`#${id}`)
		if (message) message.remove()
	}

	// Remove a specific message element
	static removeByElement(messageElement) {
		if (messageElement && messageElement.parentNode) {
			messageElement.parentNode.removeChild(messageElement)
		}
	}

	// Hide certain message
	static hide(text) {
		const hideFc = () => {
			const messages = document.querySelectorAll('.messages .msg')
			if (!messages) return

			messages.forEach((message) => {
				if (message.textContent.includes(text)) {
					message.remove()
				}
			})
		}

		MimeDOM.runFunctionAfterElementExists('body', '.messages .msg', hideFc(text))
	}
}

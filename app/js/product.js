document.addEventListener('DOMContentLoaded', function () {
	const select = document.getElementById('simple-variants-select')
	if (!select) return

	// Skryjeme originální select
	select.style.display = 'none'

	// Vytvoříme kontejner pro nové UI
	const wrapper = document.createElement('div')
	wrapper.className = 'custom-variants-wrapper'

	// Přidáme jednotlivé možnosti jako radio buttony
	Array.from(select.options).forEach((option, index) => {
		if (option.value === '') return // Přeskočit placeholder

		const radioId = `custom-variant-${index}`

		const div = document.createElement('label')
		div.className = 'custom-variant-option'
		div.htmlFor = radioId

		const labelDiv = document.createElement('div')
		labelDiv.className = 'custom-variant-label'

		const radio = document.createElement('input')
		radio.type = 'radio'
		radio.name = 'custom-variant'
		radio.value = option.value
		radio.id = radioId

		if (option.selected) {
			radio.checked = true
		}

		// Vyčistíme text: odstraníme "Počet generací:", "Skladem", závorky atd.
		let cleanText = option.textContent
			.replace('Počet generací:', '')
			.replace(/\s*[-–—]\s*Skladem.*/i, '') // odstraní pomlčku + Skladem + vše za tím
			.replace(/\s*\(\s*[^)]*\)/g, '') // odstraní cenu v závorkách
			.trim()

		// Získáme cenu z atributu (je spolehlivější než parsování textu)
		const price = option.getAttribute('data-customerprice')?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč' || ''

		const textSpan = document.createElement('span')
		textSpan.textContent = cleanText

		const priceSpan = document.createElement('span')
		priceSpan.textContent = price

		radio.addEventListener('change', () => {
			select.value = radio.value
			const event = new Event('change', { bubbles: true })
			select.dispatchEvent(event)
		})

		labelDiv.appendChild(radio)
		labelDiv.appendChild(textSpan)
		div.appendChild(labelDiv)
		div.appendChild(priceSpan)
		wrapper.appendChild(div)
	})

	// Vložíme nový UI před původní select
	select.parentNode.insertBefore(wrapper, select)
})

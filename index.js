activitati = JSON.parse(localStorage.getItem('activitati')) || [];
const formularNouActivitati = document.querySelector('#formularActivitateNoua');
const procentajElement = document.querySelector('#procentajMain');
const procentajPopUp = document.querySelector('#procentajPopUp')
const progresMain = document.querySelector("#progresMain");
const cheieSaptamnala = 'popupShowed';
const popup = document.getElementById('popupDiv');
const procentajFinal = document.getElementById('popupProgress')
const overlay = document.getElementById('overlay');
const exitBtn = document.getElementById('exitBtn');
	
let procentaj = 0;
	
formularNouActivitati.addEventListener('submit', e => {
	e.preventDefault();
	const activitate = {
		continut: e.target.elements.continut.value,
		done: false,
	}
	activitati.push(activitate);
	localStorage.setItem('activitati', JSON.stringify(activitati));
	e.target.reset();
	afiseazaActivitati();
	afiseazaProcentaj();
})

afiseazaActivitati();
afiseazaProcentaj();
	
function afiseazaActivitati() {
	const listaActivitati = document.querySelector('#listaActivitati');
	listaActivitati.innerHTML = "";
	activitati.forEach(activitate => {
		const activitateElement = document.createElement('div');
		activitateElement.classList.add('activitate-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const continut = document.createElement('div');
		const actiuni = document.createElement('div');
		const butonEdit = document.createElement('button');
		const butonDel = document.createElement('button');

		input.type = 'checkbox';
		input.checked = activitate.done;

		continut.classList.add('activitate-continut');
		actiuni.classList.add('actiuni');
		butonEdit.classList.add('butonEdit');
		butonDel.classList.add('delete');

		continut.innerHTML = `<input type="text" value="${activitate.continut}" class="continut" readonly>`;
		
		butonEdit.innerHTML = 'Editeaza';
		butonEdit.className = 'button';
		butonEdit.style = 'width : 100px;'
		
		butonDel.innerHTML = 'Sterge';
		butonDel.className = 'button';
		butonDel.style = 'width : 100px;'

		label.appendChild(input);
		label.appendChild(span);
		actiuni.appendChild(butonEdit);
		actiuni.appendChild(butonDel);
		activitateElement.appendChild(label);
		activitateElement.appendChild(continut);
		activitateElement.appendChild(actiuni);

		listaActivitati.appendChild(activitateElement);
		
		input.addEventListener('change', (e) => {
			activitate.done = e.target.checked;
			localStorage.setItem('activitati', JSON.stringify(activitati));

			if (activitate.done) {
				activitateElement.classList.add('done');
			} else {
				activitateElement.classList.remove('done');
			}
			afiseazaProcentaj();
			afiseazaActivitati();
		})

		butonEdit.addEventListener('click', (e) => {
			const input = continut.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				activitate.continut = e.target.value;
				localStorage.setItem('activitati', JSON.stringify(activitati));
				afiseazaActivitati();
				afiseazaProcentaj();
			})
		})

		butonDel.addEventListener('click', (e) => {
			activitati = activitati.filter(t => t != activitate);
			localStorage.setItem('activitati', JSON.stringify(activitati));
			afiseazaActivitati();
			afiseazaProcentaj();
		})
	})
}
	
function afiseazaProcentaj() {
	const activitati = JSON.parse(localStorage.getItem('activitati')) || [];
	const numarActivitatiComplete = activitati.filter(activitate => activitate.done).length;
	let valoareProgres = procentaj;
	procentaj = numarActivitatiComplete > 0 ? Math.round(numarActivitatiComplete / activitati.length * 100) : 0;
	overlay.style.display = 'block';
	let viteza = 20;
	let progres;

	if(valoareProgres === procentaj) {
		overlay.style.display = 'none';
		return;
	}

	progres = setInterval(() => {
		if(valoareProgres < procentaj)
			valoareProgres++;
		else
			valoareProgres--;

		procentajElement.textContent = `${valoareProgres}%`;
		progresMain.style.background = `conic-gradient(
		#4d5bf9 ${valoareProgres * 3.6}deg,
		#cadcff ${valoareProgres * 3.6}deg
		)`;
		if(valoareProgres === procentaj){
			clearInterval(progres);	
			overlay.style.display = 'none';
		}
	} ,viteza);
}
	
function esteLuni() {
	const now = new Date();
	return now.getDay() === 1;
}

function popupShowed() {
	return localStorage.getItem(cheieSaptamnala) === 'true';
}

function arataPopup() {
	const div = document.getElementById('popupDiv');
	const popupOverlay = document.getElementById('popupOverlay');
	div.classList.add('show');
	popupOverlay.style.display = 'block';
	afiseazaProcentajFinal();
	localStorage.setItem(cheieSaptamnala, 'true');
}  

setInterval(() => {
	if (esteLuni() && !popupShowed()) {
		arataPopup();
	}
	else if( !esteLuni() ){
		localStorage.setItem(cheieSaptamnala,'false');
	}
}, 1000);
	
function afiseazaProcentajFinal() {
	const activitati = JSON.parse(localStorage.getItem('activitati')) || [];
	const numarActivitatiComplete = activitati.filter(activitate => activitate.done).length;
	let valoareProgres = 0;
	procentaj = numarActivitatiComplete > 0 ? Math.round(numarActivitatiComplete / activitati.length * 100) : 0;
	let viteza = 20;	
	let progres;

	if(valoareProgres === procentaj) return;
	progres = setInterval(() => {
		valoareProgres++;
		procentajPopUp.textContent = `${valoareProgres}%`;
		procentajFinal.style.background = `conic-gradient(
		#4d5bf9 ${valoareProgres * 3.6}deg,
		#cadcff ${valoareProgres * 3.6}deg
		)`;
		if(valoareProgres === procentaj){
			clearInterval(progres);		
		}
	} ,viteza);
}

exitBtn.addEventListener('click', function() {
	localStorage.clear();
	location.reload();
});
function findCountries() {
    const name = document.getElementById('nameInput').value.trim();
    const resultDiv = document.getElementById('result');
  
    if (!name) {
      resultDiv.innerHTML = 'Введите имя.';
      return;
    }
  
    fetch(`https://api.nationalize.io?name=${name}`)
      .then(response => response.json())
      .then(data => {
        if (!data.country || data.country.length === 0) {
          resultDiv.innerHTML = 'Нет данных по этому имени.';
          return;
        }
  
        const countries = data.country;
        const countryCodes = countries.map(c => c.country_id).join(',');
  
        // Получаем данные стран с флагами
        fetch(`https://restcountries.com/v3.1/alpha?codes=${countryCodes}`)
          .then(response => response.json())
          .then(countryData => {
            const flagMap = {};
            countryData.forEach(c => {
              flagMap[c.cca2] = c.flags.svg; // сохраняем флаги по коду страны
            });
  
            let html = `<h2>Имя: ${name}</h2><ul>`;
            countries.forEach(entry => {
              const code = entry.country_id;
              const flagUrl = flagMap[code];
              const probability = (entry.probability * 100).toFixed(2);
              html += `
                <li>
                  ${flagUrl ? `<img src="${flagUrl}" alt="${code}" width="24" style="vertical-align:middle;">` : ''}
                  ${code} — ${probability}%
                </li>`;
            });
            html += '</ul>';
            resultDiv.innerHTML = html;
          });
      })
      .catch(error => {
        console.error(error);
        resultDiv.innerHTML = 'Произошла ошибка при получении данных.';
      });
  }
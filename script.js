<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculadora del Sistema de Intereses Automatizada</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg: #f8fafc;
            --surface: #ffffff;
            --text: #1e293b;
            --border: #e2e8f0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 1100px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            margin-bottom: 30px;
        }

        h1 {
            color: #0f172a;
            margin-bottom: 5px;
        }

        .grid-inputs {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            background: var(--surface);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        label {
            font-weight: 600;
            font-size: 0.9rem;
        }

        input, select {
            padding: 10px;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 1rem;
            outline: none;
            transition: border 0.2s;
        }

        input:focus, select:focus {
            border-color: var(--primary);
        }

        button {
            grid-column: 1 / -1;
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 12px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
        }

        button:hover {
            background-color: var(--primary-hover);
        }

        .results-section {
            background: var(--surface);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow-x: auto;
        }

        .table-title {
            margin-top: 0;
            font-size: 1.3rem;
            border-bottom: 2px solid var(--border);
            padding-bottom: 10px;
            color: var(--primary);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            text-align: left;
        }

        th, td {
            padding: 12px;
            border-bottom: 1px solid var(--border);
        }

        th {
            background-color: #f1f5f9;
            font-weight: 600;
        }

        tr:hover {
            background-color: #f8fafc;
        }

        .text-right {
            text-align: right;
        }
    </style>
</head>
<body>

<div class="container">
    <header>
        <h1>Core Financiero: Motor de Intereses</h1>
        <p>Generación automatizada de tablas de amortización multicanal</p>
    </header>

    <div class="grid-inputs">
        <div class="form-group">
            <label for="assetValue">Valor del Activo ($)</label>
            <input type="number" id="assetValue" value="10000" min="1" step="0.01">
        </div>
        <div class="form-group">
            <label for="term">Plazo (Meses)</label>
            <input type="number" id="term" value="12" min="1" step="1">
        </div>
        <div class="form-group">
            <label for="interestRate">Tasa de Interés Anual (%)</label>
            <input type="number" id="interestRate" value="12" min="0" step="0.1">
        </div>
        <div class="form-group">
            <label for="systemType">Sistema de Amortización</label>
            <select id="systemType">
                <option value="FRANCES">Francés (Cuota Constante)</option>
                <option value="LINEAL">Lineal / Alemán (Amortización Constante)</option>
                <option value="REGRESIVO">Regresivo (Cuota Decreciente Dinámica)</option>
            </select>
        </div>
        <button onclick="engine.calculate()">Procesar Simulación Financiera</button>
    </div>

    <div class="results-section">
        <h2 class="table-title" id="reportTitle">Proyección de Pagos</h2>
        <table>
            <thead>
                <tr>
                    <th>Nro. Cuota</th>
                    <th class="text-right">Cuota Total</th>
                    <th class="text-right">Interés</th>
                    <th class="text-right">Amortización</th>
                    <th class="text-right">Saldo Pendiente</th>
                </tr>
            </thead>
            <tbody id="simulationTable">
                </tbody>
        </table>
    </div>
</div>

<script>
/**
 * Arquitectura del Motor Financiero (Fintech Engine)
 */
const engine = {
    // Formateador de moneda integrado
    formatCurrency: (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    },

    calculate: function() {
        // Recolección y saneamiento de datos (Inputs)
        const principal = parseFloat(document.getElementById('assetValue').value);
        const periods = parseInt(document.getElementById('term').value);
        const annualRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const system = document.getElementById('systemType').value;
        
        const monthlyRate = annualRate / 12;
        const tbody = document.getElementById('simulationTable');
        tbody.innerHTML = ''; // Limpiar ejecuciones previas

        let schedule = [];

        // Orquestador de Sistemas Financieros
        switch(system) {
            case 'FRANCES':
                schedule = this.runFrances(principal, periods, monthlyRate);
                document.getElementById('reportTitle').innerText = 'Sistema Francés - Cuotas Fijas';
                break;
            case 'LINEAL':
                schedule = this.runLineal(principal, periods, monthlyRate);
                document.getElementById('reportTitle').innerText = 'Sistema Lineal / Alemán - Amortización Fija';
                break;
            case 'REGRESIVO':
                schedule = this.runRegresivo(principal, periods, monthlyRate);
                document.getElementById('reportTitle').innerText = 'Sistema Regresivo - Amortización Acelerada';
                break;
        }

        // Renderizado eficiente en el DOM
        schedule.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.period}</td>
                <td class="text-right"><b>${this.formatCurrency(row.payment)}</b></td>
                <td class="text-right" style="color: #dc2626;">${this.formatCurrency(row.interest)}</td>
                <td class="text-right" style="color: #16a34a;">${this.formatCurrency(row.amortization)}</td>
                <td class="text-right">${this.formatCurrency(row.balance)}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    // 1. SISTEMA FRANCÉS: Cuota fija calculada mediante rentas constantes
    runFrances: function(principal, periods, rate) {
        let balance = principal;
        let schedule = [];
        // Fórmula de la cuota fija: C = P * (r * (1+r)^n) / ((1+r)^n - 1)
        let payment = rate > 0 ? (principal * (rate * Math.pow(1 + rate, periods))) / (Math.pow(1 + rate, periods) - 1) : principal / periods;

        for (let i = 1; i <= periods; i++) {
            let interest = balance * rate;
            let amortization = payment - interest;
            balance -= amortization;
            if (balance < 0 || i === periods) balance = 0; // Ajuste por redondeo numérico

            schedule.push({ period: i, payment, interest, amortization, balance });
        }
        return schedule;
    },

    // 2. SISTEMA LINEAL (ALEMÁN): Amortización constante del capital inicial
    runLineal: function(principal, periods, rate) {
        let balance = principal;
        let schedule = [];
        let amortization = principal / periods; // Amortización lineal

        for (let i = 1; i <= periods; i++) {
            let interest = balance * rate;
            let payment = amortization + interest;
            balance -= amortization;
            if (balance < 0 || i === periods) balance = 0;

            schedule.push({ period: i, payment, interest, amortization, balance });
        }
        return schedule;
    },

    // 3. SISTEMA REGRESIVO: Mitigación acelerada del riesgo. 
    // Amortiza más capital en los primeros períodos decreciendo linealmente.
    runRegresivo: function(principal, periods, rate) {
        let balance = principal;
        let schedule = [];
        
        // Suma de los dígitos de los períodos (Factorial de suma para distribución regresiva)
        // Ejemplo para 3 meses: 3 + 2 + 1 = 6
        let sumOfDigits = (periods * (periods + 1)) / 2;

        for (let i = 1; i <= periods; i++) {
            let interest = balance * rate;
            // El factor cambia de manera inversa al período actual (Ejem: mes 1 se lleva 3/6 de la amortización)
            let dynamicFactor = (periods - i + 1) / sumOfDigits;
            let amortization = principal * dynamicFactor;
            let payment = amortization + interest;
            balance -= amortization;
            if (balance < 0 || i === periods) balance = 0;

            schedule.push({ period: i, payment, interest, amortization, balance });
        }
        return schedule;
    }
};

// Ejecución inicial automática al cargar el DOM
window.onload = () => engine.calculate();
</script>

</body>
</html>
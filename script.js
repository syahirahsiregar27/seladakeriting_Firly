// ==========================================================
// SELADADAR - SMART FARMING SELADA
// SCRIPT.JS
// ==========================================================


// ==========================================================
// 1. NAVIGASI
// ==========================================================

const menuLinks = document.querySelectorAll(".menu");
const pages = document.querySelectorAll(".page");
const judulHalaman = document.getElementById("judulHalaman");


menuLinks.forEach(menu => {

    menu.addEventListener("click", function (e) {

        e.preventDefault();

        const target =
            this.getAttribute("href").substring(1);

        pages.forEach(page => {
            page.classList.remove("active");
        });

        menuLinks.forEach(link => {
            link.classList.remove("active");
        });

        const halamanTujuan =
            document.getElementById(target);

        if (halamanTujuan) {

            halamanTujuan.classList.add("active");

            this.classList.add("active");

            if (judulHalaman) {
                judulHalaman.textContent =
                    this.textContent.trim();
            }

            window.location.hash = target;
        }

    });

});


// ==========================================================
// 2. BUKA HALAMAN BERDASARKAN HASH
// ==========================================================

function bukaHalamanAwal() {

    const target =
        window.location.hash.substring(1);

    if (!target) return;

    const halaman =
        document.getElementById(target);

    if (
        halaman &&
        halaman.classList.contains("page")
    ) {

        pages.forEach(page => {
            page.classList.remove("active");
        });

        menuLinks.forEach(link => {
            link.classList.remove("active");
        });

        halaman.classList.add("active");

        const menu =
            document.querySelector(
                `.menu[href="#${target}"]`
            );

        if (menu) {

            menu.classList.add("active");

            if (judulHalaman) {
                judulHalaman.textContent =
                    menu.textContent.trim();
            }

        }

    }

}

bukaHalamanAwal();


// ==========================================================
// 3. JAM DIGITAL
// ==========================================================

function tampilkanJam() {

    const sekarang =
        new Date();

    const jam =
        sekarang.toLocaleTimeString(
            "id-ID",
            {
                hour12: false
            }
        );

    const jamDigital =
        document.getElementById(
            "jamDigital"
        );

    if (jamDigital) {
        jamDigital.textContent = jam;
    }

}

tampilkanJam();

setInterval(
    tampilkanJam,
    1000
);


// ==========================================================
// 4. UMUR TANAMAN
// ==========================================================

const tanggalTanam =
    document.getElementById(
        "tanggalTanam"
    );


function hitungUmurTanaman() {

    if (!tanggalTanam) return;

    if (!tanggalTanam.value) {

        const umur =
            document.getElementById(
                "umurTanaman"
            );

        if (umur) {
            umur.textContent =
                "Hari ke-1";
        }

        return;
    }


    const tanggal =
        new Date(
            tanggalTanam.value +
            "T00:00:00"
        );

    const sekarang =
        new Date();

    sekarang.setHours(
        0,
        0,
        0,
        0
    );


    if (isNaN(tanggal.getTime())) {
        return;
    }


    if (tanggal > sekarang) {

        alert(
            "Tanggal tanam tidak boleh melebihi hari ini!"
        );

        return;
    }


    const selisih =
        Math.floor(
            (
                sekarang - tanggal
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        ) + 1;


    const umur =
        selisih;


    const umurTanaman =
        document.getElementById(
            "umurTanaman"
        );

    const prediksiUmur =
        document.getElementById(
            "prediksiUmur"
        );

    const tanggalTanamText =
        document.getElementById(
            "tanggalTanamText"
        );


    if (umurTanaman) {

        umurTanaman.textContent =
            "Hari ke-" + umur;

    }


    if (prediksiUmur) {

        prediksiUmur.textContent =
            umur + " HST";

    }


    if (tanggalTanamText) {

        tanggalTanamText.textContent =
            tanggal.toLocaleDateString(
                "id-ID",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }

}


if (tanggalTanam) {

    tanggalTanam.addEventListener(
        "change",
        hitungUmurTanaman
    );

    hitungUmurTanaman();

}


// ==========================================================
// 5. FUNGSI GRAFIK
// ==========================================================

function buatGrafik(
    id,
    label,
    warna = "#91d66b"
) {

    const canvas =
        document.getElementById(id);

    if (!canvas) {
        return null;
    }


    return new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels: [],

                datasets: [
                    {

                        label: label,

                        data: [],

                        borderColor: warna,

                        backgroundColor:
                            "rgba(145,214,107,0.10)",

                        fill: true,

                        tension: 0.4,

                        borderWidth: 2,

                        pointRadius: 0

                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    x: {
                        display: false
                    },

                    y: {
                        display: false
                    }

                }

            }

        }
    );

}


// ==========================================================
// 6. GRAFIK DASHBOARD
// ==========================================================

const grafikDashboard = {

    suhu:
        buatGrafik(
            "grafikSuhu",
            "Suhu Udara",
            "#70a7ff"
        ),

    udara:
        buatGrafik(
            "grafikKelembapanUdara",
            "Kelembapan Udara",
            "#70d7ff"
        ),

    tanah:
        buatGrafik(
            "grafikKelembapan",
            "Kelembapan Tanah",
            "#91d66b"
        )

};

const REALTIME_HISTORY_LIMIT = 15;
const REALTIME_CHART_HISTORY_LIMIT = 60;
const realtimeHistory = [];
const realtimeChartHistory = [];

function buatGrafikRealTime(id, label, warna) {
    const canvas = document.getElementById(id);
    if (!canvas || typeof Chart === "undefined") return null;

    return new Chart(canvas, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label,
                data: [],
                borderColor: warna,
                backgroundColor: `${warna}22`,
                fill: true,
                tension: 0.35,
                borderWidth: 2,
                pointRadius: 0,
                spanGaps: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--muted").trim(),
                        maxTicksLimit: 7,
                        maxRotation: 0
                    },
                    grid: { color: "rgba(130, 150, 140, 0.10)" }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--muted").trim()
                    },
                    grid: { color: "rgba(130, 150, 140, 0.14)" }
                }
            }
        }
    });
}

const grafikRealTime = {
    tanah: buatGrafikRealTime("grafikRealTimeTanah", "Soil Moisture (%)", "#91d66b"),
    suhu: buatGrafikRealTime("grafikRealTimeSuhu", "Suhu (°C)", "#70a7ff"),
    udara: buatGrafikRealTime("grafikRealTimeUdara", "Kelembapan Udara (%)", "#70d7cf")
};

function nilaiSensorTeks(value, digits = 1) {
    return value === null || value === undefined || !Number.isFinite(Number(value))
        ? "--"
        : Number(value).toFixed(digits);
}

function statusPembacaanSensor() {
    const soil = sensorData.kelembapanTanah;
    const suhu = sensorData.suhu;
    const udara = sensorData.kelembapanUdara;
    const warning = (soil !== null && (soil < 65 || soil > 78)) ||
        (suhu !== null && (suhu < 18 || suhu > 24)) ||
        (udara !== null && (udara < 60 || udara > 75));
    return warning ? "Peringatan" : "Normal";
}

function tambahPembacaanRealTime() {
    const entry = {
        timestamp: new Date(),
        kelembapanTanah: sensorData.kelembapanTanah,
        suhu: sensorData.suhu,
        kelembapanUdara: sensorData.kelembapanUdara,
        pompa: pompaMenyala ? "ON" : "OFF",
        status: statusPembacaanSensor()
    };
    realtimeHistory.push(entry);
    if (realtimeHistory.length > REALTIME_HISTORY_LIMIT) realtimeHistory.shift();
    realtimeChartHistory.push(entry);
    if (realtimeChartHistory.length > REALTIME_CHART_HISTORY_LIMIT) realtimeChartHistory.shift();
    renderPembacaanRealTime();
}

function renderPembacaanRealTime() {
    const body = document.getElementById("realtimeTableBody");
    const count = document.getElementById("realtimeCount");
    if (count) count.textContent = `(${realtimeHistory.length} pembacaan terakhir)`;

    if (body) {
        if (!realtimeHistory.length) {
            body.innerHTML = '<tr class="realtime-empty-row"><td colspan="6">Menunggu data sensor real-time.</td></tr>';
        } else {
            body.replaceChildren(...realtimeHistory.slice().reverse().map(entry => {
                const row = document.createElement("tr");
                const values = [
                    entry.timestamp.toLocaleString("sv-SE").replace("T", " "),
                    nilaiSensorTeks(entry.kelembapanTanah),
                    nilaiSensorTeks(entry.suhu),
                    nilaiSensorTeks(entry.kelembapanUdara),
                    entry.pompa,
                    entry.status
                ];
                values.forEach((value, index) => {
                    const cell = document.createElement("td");
                    if (index === 5) {
                        const badge = document.createElement("span");
                        badge.className = `realtime-status-badge ${entry.status === "Normal" ? "is-normal" : "is-warning"}`;
                        badge.textContent = value;
                        cell.appendChild(badge);
                    } else {
                        cell.textContent = value;
                    }
                    row.appendChild(cell);
                });
                return row;
            }));
        }
    }

    const labels = realtimeChartHistory.map(entry => entry.timestamp.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }));
    [
        [grafikRealTime.tanah, "kelembapanTanah"],
        [grafikRealTime.suhu, "suhu"],
        [grafikRealTime.udara, "kelembapanUdara"]
    ].forEach(([chart, property]) => {
        if (!chart) return;
        chart.data.labels = labels;
        chart.data.datasets[0].data = realtimeChartHistory.map(entry => entry[property]);
        chart.update("none");
    });
}

function refreshRealtimeChartTheme() {
    const muted = getComputedStyle(document.body).getPropertyValue("--muted").trim();
    Object.values(grafikRealTime).forEach(chart => {
        if (!chart) return;
        chart.options.scales.x.ticks.color = muted;
        chart.options.scales.y.ticks.color = muted;
        chart.update("none");
    });
}


// ==========================================================
// 7. DATA SENSOR
// ==========================================================

let sensorData = {

    suhu: null,

    kelembapanUdara: null,

    kelembapanTanah: null

};


// ==========================================================
// 8. UPDATE SENSOR
// ==========================================================

function updateSensorData(data) {

    if (!data) return;


    // ------------------------------
    // SUHU
    // ------------------------------

    if (
        data.suhu !== undefined &&
        data.suhu !== null
    ) {

        const nilai =
            Number(data.suhu);

        if (!isNaN(nilai)) {

            sensorData.suhu =
                nilai;


            const element =
                document.getElementById(
                    "suhu"
                );

            if (element) {

                element.innerHTML =
                    nilai.toFixed(1) +
                    ' <small>°C</small>';

            }


            const status =
                document.getElementById(
                    "statusSuhu"
                );

            if (status) {

                status.textContent =
                    (
                        nilai >= 18 &&
                        nilai <= 24
                    )
                        ? "Ideal"
                        : "Perlu perhatian";

            }


            tambahDataGrafik(
                grafikDashboard.suhu,
                nilai
            );

        }

    }


    // ------------------------------
    // KELEMBAPAN UDARA
    // ------------------------------

    if (
        data.kelembapanUdara !== undefined &&
        data.kelembapanUdara !== null
    ) {

        const nilai =
            Number(
                data.kelembapanUdara
            );

        if (!isNaN(nilai)) {

            sensorData.kelembapanUdara =
                nilai;


            const element =
                document.getElementById(
                    "kelembapanUdara"
                );

            if (element) {

                element.innerHTML =
                    nilai +
                    ' <small>%</small>';

            }


            const status =
                document.getElementById(
                    "statusUdara"
                );

            if (status) {

                status.textContent =
                    (
                        nilai >= 60 &&
                        nilai <= 75
                    )
                        ? "Ideal"
                        : "Perlu perhatian";

            }


            tambahDataGrafik(
                grafikDashboard.udara,
                nilai
            );

        }

    }


    // ------------------------------
    // KELEMBAPAN TANAH
    // ------------------------------

    if (
        data.kelembapanTanah !== undefined &&
        data.kelembapanTanah !== null
    ) {

        updateKelembapanTanah(
            data.kelembapanTanah,
            true
        );

    }

    updateLSTMSensorSummary();
    if (
        data.suhu !== undefined ||
        data.kelembapanUdara !== undefined ||
        data.kelembapanTanah !== undefined
    ) {
        tambahPembacaanRealTime();
    }

}


window.updateSensorData =
    updateSensorData;


// ==========================================================
// 9. TAMBAH DATA GRAFIK
// ==========================================================

function tambahDataGrafik(
    chart,
    nilai
) {

    if (
        !chart ||
        nilai === null ||
        nilai === undefined
    ) {
        return;
    }


    const waktu =
        new Date().toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    chart.data.labels.push(waktu);

    chart.data.datasets[0].data.push(
        Number(nilai)
    );


    if (
        chart.data.labels.length >
        20
    ) {

        chart.data.labels.shift();

        chart.data.datasets[0]
            .data.shift();

    }


    chart.update("none");

}


// ==========================================================
// 10. BATAS POMPA
// ==========================================================

const BATAS_POMPA_ON = 65;

const BATAS_POMPA_OFF = 78;


// ==========================================================
// 11. MODE SISTEM
// ==========================================================

const modeSistem =
    "otomatis";


// ==========================================================
// 12. STATUS POMPA
// ==========================================================

let pompaMenyala =
    false;


// ==========================================================
// 13. UPDATE TAMPILAN POMPA
// ==========================================================

function updateTampilanPompa() {

    const statusDetail =
        document.getElementById(
            "statusPompaDetail"
        );

    const indikator =
        document.getElementById(
            "indikatorPompa"
        );

    const keterangan =
        document.getElementById(
            "keteranganModePompa"
        );


    if (statusDetail) {

        statusDetail.textContent =
            pompaMenyala
                ? "Pompa dalam keadaan NYALA"
                : "Pompa dalam keadaan MATI";

    }


    if (indikator) {

        indikator.textContent =
            pompaMenyala
                ? "Pompa menyala"
                : "Pompa mati";

    }


    if (keterangan) {
        keterangan.textContent =
            "Mode otomatis aktif. Pompa dikendalikan berdasarkan kelembapan tanah.";

    }

}


// ==========================================================
// 14. SET POMPA
// ==========================================================

function setPompa(
    statusBaru
) {

    pompaMenyala =
        Boolean(statusBaru);

    updateTampilanPompa();

}


// ==========================================================
// 16. KELEMBAPAN TANAH
// ==========================================================

function updateKelembapanTanah(
    nilai,
    skipRealtimeEntry = false
) {

    nilai =
        Number(nilai);

    if (isNaN(nilai)) {
        return;
    }


    sensorData.kelembapanTanah =
        nilai;


    const tampilan =
        document.getElementById(
            "kelembapan"
        );


    if (tampilan) {

        tampilan.innerHTML =
            nilai +
            ' <small>%</small>';

    }


    const kondisi =
        document.getElementById(
            "kondisi"
        );


    if (kondisi) {

        if (
            nilai <
            BATAS_POMPA_ON
        ) {

            kondisi.textContent =
                "Kering";

        }
        else if (
            nilai >
            BATAS_POMPA_OFF
        ) {

            kondisi.textContent =
                "Basah";

        }
        else {

            kondisi.textContent =
                "Ideal";

        }

    }


    tambahDataGrafik(
        grafikDashboard.tanah,
        nilai
    );


    if (
        modeSistem ===
        "otomatis"
    ) {

        kontrolPompaOtomatis(
            nilai
        );

    }

    if (!skipRealtimeEntry) tambahPembacaanRealTime();

}


window.updateKelembapanTanah =
    updateKelembapanTanah;


// ==========================================================
// 17. KONTROL POMPA OTOMATIS
// ==========================================================

function kontrolPompaOtomatis(
    nilai
) {

    nilai =
        Number(nilai);

    if (isNaN(nilai)) {
        return;
    }


    if (
        nilai <
        BATAS_POMPA_ON
    ) {

        setPompa(true);

        return;

    }


    if (
        nilai >
        BATAS_POMPA_OFF
    ) {

        setPompa(false);

        return;

    }

}


updateTampilanPompa();


// ==========================================================
// 20. TEMA
// ==========================================================

const tombolTema =
    document.getElementById(
        "tombolTema"
    );


if (tombolTema) {

    tombolTema.addEventListener(
        "click",
        function () {

            document.body
                .classList
                .toggle(
                    "light-mode"
                );
            refreshRealtimeChartTheme();

        }
    );

}


// ==========================================================
// 21. LSTM
// ==========================================================

const btnRefreshLSTM =
    document.getElementById(
        "btnRefreshLSTM"
    );

function formatLSTMSensor(value, unit) {
    const number = Number(value);
    return value !== null && value !== undefined && Number.isFinite(number)
        ? `${number.toFixed(1)} ${unit}`
        : `-- ${unit}`;
}

function updateLSTMSensorSummary() {
    const soil = document.getElementById("lstmKelembapanTanahSaatIni");
    const temperature = document.getElementById("lstmSuhuSaatIni");
    const humidity = document.getElementById("lstmKelembapanUdaraSaatIni");
    const advice = document.getElementById("lstmSaranUmum");

    if (soil) soil.textContent = formatLSTMSensor(sensorData.kelembapanTanah, "%");
    if (temperature) temperature.textContent = formatLSTMSensor(sensorData.suhu, "°C");
    if (humidity) humidity.textContent = formatLSTMSensor(sensorData.kelembapanUdara, "%");
    if (!lstmPredictionData) {
        for (let day = 1; day <= 4; day += 1) {
            const moistureValue = document.getElementById(`lstmKelembapan${day}`);
            const temperatureValue = document.getElementById(`lstmSuhu${day}`);
            if (moistureValue) moistureValue.textContent = formatLSTMSensor(sensorData.kelembapanTanah, "%");
            if (temperatureValue) temperatureValue.textContent = formatLSTMSensor(sensorData.suhu, "°C");
        }
    }

    if (!advice) return;
    const recommendations = [];
    if (sensorData.kelembapanTanah !== null) {
        if (sensorData.kelembapanTanah < 65) recommendations.push("Tanah cenderung kering, siapkan penyiraman atau pastikan pompa aktif");
        else if (sensorData.kelembapanTanah > 78) recommendations.push("Tanah terlalu lembap, kurangi penyiraman sementara");
    }
    if (sensorData.suhu !== null) {
        if (sensorData.suhu < 18) recommendations.push("Suhu rendah, lindungi tanaman dari dingin");
        else if (sensorData.suhu > 24) recommendations.push("Suhu tinggi, bantu sirkulasi udara dan kurangi paparan panas");
    }
    if (sensorData.kelembapanUdara !== null && sensorData.kelembapanUdara < 60) {
        recommendations.push("Udara kering, pertimbangkan misting");
    } else if (sensorData.kelembapanUdara !== null && sensorData.kelembapanUdara > 75) {
        recommendations.push("Kelembapan udara tinggi, pastikan sirkulasi tetap baik");
    }
    const hasSensorData = [
        sensorData.kelembapanTanah,
        sensorData.suhu,
        sensorData.kelembapanUdara
    ].some(value => value !== null);
    advice.textContent = recommendations.length
        ? `${recommendations.join(". ")}.`
        : hasSensorData
            ? "Kondisi sensor saat ini berada dalam rentang ideal."
            : "Menunggu data sensor untuk memberikan saran perawatan.";
}

const umurLSTMHari = document.getElementById("umurLSTMHari");
const tanggalTanamLSTM = document.getElementById("tanggalTanamLSTM");
let chartKematanganLSTM = null;
let lstmPredictionData = null;

function umurTanamanSekarang() {
    if (tanggalTanam && tanggalTanam.value) {
        const plantingDate = new Date(`${tanggalTanam.value}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!Number.isNaN(plantingDate.getTime()) && plantingDate <= today) {
            return Math.floor((today - plantingDate) / 86400000) + 1;
        }
    }
    return null;
}

function sinkronkanUmurLSTM() {
    const age = umurTanamanSekarang();
    if (umurLSTMHari && age !== null) umurLSTMHari.value = age;
    if (tanggalTanamLSTM && tanggalTanam && tanggalTanam.value) {
        tanggalTanamLSTM.value = tanggalTanam.value;
    }
}

function renderGrafikKematanganLSTM() {
    if (!chartKematanganLSTM) return;
    const data = lstmPredictionData || {};
    const labels = Array.from({ length: 11 }, (_, index) => `HST ${index * 4}`);
    const actualValues = Array(labels.length).fill(null);
    const projectionValues = Array(labels.length).fill(null);
    const history = Array.isArray(data.history) ? data.history : (Array.isArray(data.actual) ? data.actual : []);

    history.forEach(point => {
        const day = Number(point.hari ?? point.day ?? point.hst);
        const value = Number(point.value ?? point.persen ?? point.maturity);
        const index = Math.round(day / 4);
        if (Number.isFinite(day) && Number.isFinite(value) && index >= 0 && index < actualValues.length) {
            actualValues[index] = value;
        }
    });

    (Array.isArray(data.predictions) ? data.predictions : []).slice(0, 4).forEach((point, index) => {
        const ageValue = Number(umurLSTMHari && umurLSTMHari.value);
        const currentAge = Number.isFinite(ageValue) && ageValue > 0 ? ageValue : null;
        const forecastDay = Number(point.hari ?? point.day ?? (currentAge === null ? (index + 1) * 4 : currentAge + index + 1));
        const value = Number(point.value ?? point.prediction ?? point.persen);
        const chartIndex = Math.round(forecastDay / 4);
        if (Number.isFinite(forecastDay) && Number.isFinite(value) && value >= 0 && value <= 100 && chartIndex >= 0 && chartIndex < projectionValues.length) {
            projectionValues[chartIndex] = value;
        }
    });

    chartKematanganLSTM.data.datasets[0].data = actualValues;
    chartKematanganLSTM.data.datasets[1].data = projectionValues;
    chartKematanganLSTM.update("none");

    const status = document.getElementById("statusGrafikLSTM");
    if (status) {
        status.textContent = actualValues.some(value => value !== null)
            ? "Data aktual tersedia"
            : projectionValues.some(value => value !== null)
                ? "Proyeksi tersedia"
                : "Menunggu data aktual";
    }
}

function initGrafikKematanganLSTM() {
    const canvas = document.getElementById("grafikKematanganLSTM");
    if (!canvas || typeof Chart === "undefined") return;
    chartKematanganLSTM = new Chart(canvas, {
        type: "line",
        data: {
            labels: Array.from({ length: 11 }, (_, index) => `HST ${index * 4}`),
            datasets: [
                {
                    label: "Kematangan aktual (%)",
                    data: Array(11).fill(null),
                    borderColor: "#91d66b",
                    backgroundColor: "rgba(145, 214, 107, 0.12)",
                    tension: 0.3,
                    spanGaps: true,
                    pointRadius: 3
                },
                {
                    label: "Proyeksi menuju panen (%)",
                    data: Array(11).fill(null),
                    borderColor: "#91a795",
                    borderDash: [6, 5],
                    backgroundColor: "transparent",
                    tension: 0.3,
                    spanGaps: true,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: { callback: value => `${value}%` },
                    grid: { color: "rgba(130, 150, 140, 0.14)" }
                },
                x: { grid: { color: "rgba(130, 150, 140, 0.10)" } }
            },
            plugins: {
                legend: { position: "top", align: "center" }
            }
        }
    });
    renderGrafikKematanganLSTM();
}

if (tanggalTanamLSTM) {
    tanggalTanamLSTM.addEventListener("change", function () {
        if (tanggalTanam) {
            tanggalTanam.value = this.value;
            hitungUmurTanaman();
        }
        sinkronkanUmurLSTM();
        renderGrafikKematanganLSTM();
    });
}

if (tanggalTanam) {
    tanggalTanam.addEventListener("change", sinkronkanUmurLSTM);
}

if (umurLSTMHari) {
    umurLSTMHari.addEventListener("input", renderGrafikKematanganLSTM);
}

for (let day = 1; day <= 4; day += 1) {
    const input = document.getElementById(`lstmGambarInput${day}`);
    const image = document.getElementById(`lstmGambar${day}`);
    const placeholder = document.getElementById(`lstmGambarPlaceholder${day}`);
    if (!input || !image || !placeholder) continue;

    input.addEventListener("change", function () {
        const file = this.files && this.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Silakan pilih file gambar.");
            this.value = "";
            return;
        }
        if (image.dataset.objectUrl) URL.revokeObjectURL(image.dataset.objectUrl);
        const objectUrl = URL.createObjectURL(file);
        image.dataset.objectUrl = objectUrl;
        image.onload = () => {
            image.style.display = "block";
            placeholder.hidden = true;
        };
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            delete image.dataset.objectUrl;
            image.removeAttribute("src");
            image.style.display = "none";
            placeholder.hidden = false;
            this.value = "";
            alert("Gambar tidak dapat dibuka.");
        };
        image.src = objectUrl;
    });
}

sinkronkanUmurLSTM();
updateLSTMSensorSummary();
initGrafikKematanganLSTM();

function resetLSTMDisplay() {

    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const pred =
            document.getElementById(
                "lstmPred" + i
            );

        const bar =
            document.getElementById(
                "lstmBar" + i
            );

        const badge =
            document.getElementById(
                "lstmBadge" + i
            );

        const kondisi =
            document.getElementById(
                "lstmKondisi" + i
            );

        const tahap =
            document.getElementById(
                "lstmTahap" + i
            );

        const hari =
            document.getElementById(
                "lstmHari" + i
            );

        const dap =
            document.getElementById(
                "lstmDAP" + i
            );

        const sensor =
            document.getElementById(
                "lstmSensor" + i
            );
        const moisture =
            document.getElementById("lstmKelembapan" + i);
        const temperature =
            document.getElementById("lstmSuhu" + i);
        const advice =
            document.getElementById("lstmSaran" + i);


        if (pred) {
            pred.textContent =
                "--%";
        }

        if (bar) {
            bar.style.width =
                "0%";
        }

        if (badge) {
            badge.textContent =
                "Menunggu data";
        }

        if (kondisi) {
            kondisi.textContent =
                "Menunggu data";
        }

        if (tahap) {
            tahap.textContent =
                "Menunggu data";
        }

        if (hari) {
            hari.textContent =
                "--";
        }

        if (dap) {
            dap.textContent =
                "--";
        }

        if (sensor) {
            sensor.textContent =
                "--";
        }

        if (moisture) moisture.textContent = "--";
        if (temperature) temperature.textContent = "--";
        if (advice) advice.textContent = "Menunggu data sensor dari Firebase.";

    }

    lstmPredictionData = null;
    renderGrafikKematanganLSTM();

}


function updateLSTMData(
    data
) {

    if (
        !data ||
        !Array.isArray(
            data.predictions
        )
    ) {

        resetLSTMDisplay();

        return;

    }

    resetLSTMDisplay();
    lstmPredictionData = data;

    data.predictions
        .slice(0, 4)
        .forEach(
            (
                prediction,
                index
            ) => {

                const nomor =
                    index + 1;


                const nilai =
                    Number(
                        prediction.value ??
                        prediction.prediction ??
                        prediction.persen
                    );


                const hari =
                    prediction.hari ??
                    prediction.day ??
                    "--";


                const tahap =
                    prediction.tahap ??
                    prediction.stage ??
                    "Menunggu data";


                const kondisi =
                    prediction.kondisi ??
                    prediction.condition ??
                    "Menunggu data";


                const dap =
                    prediction.dap ??
                    "--";


                const sensor =
                    prediction.sensor ??
                    "--";


                const pred =
                    document.getElementById(
                        "lstmPred" +
                        nomor
                    );


                const bar =
                    document.getElementById(
                        "lstmBar" +
                        nomor
                    );


                const badge =
                    document.getElementById(
                        "lstmBadge" +
                        nomor
                    );


                const kondisiElement =
                    document.getElementById(
                        "lstmKondisi" +
                        nomor
                    );


                const tahapElement =
                    document.getElementById(
                        "lstmTahap" +
                        nomor
                    );


                const hariElement =
                    document.getElementById(
                        "lstmHari" +
                        nomor
                    );


                const dapElement =
                    document.getElementById(
                        "lstmDAP" +
                        nomor
                    );


                const sensorElement =
                    document.getElementById(
                        "lstmSensor" +
                        nomor
                    );
                const moistureElement =
                    document.getElementById("lstmKelembapan" + nomor);
                const temperatureElement =
                    document.getElementById("lstmSuhu" + nomor);
                const adviceElement =
                    document.getElementById("lstmSaran" + nomor);
                const soilMoisture =
                    prediction.kelembapanTanah ??
                    prediction.soilMoisture ??
                    data.kelembapanTanah ??
                    sensorData.kelembapanTanah;
                const temperature =
                    prediction.suhu ??
                    prediction.temperature ??
                    data.suhu ??
                    sensorData.suhu;


                if (pred) {

                    pred.textContent =
                        isNaN(nilai)
                            ? "--%"
                            : nilai.toFixed(1) + "%";

                }


                if (bar) {

                    bar.style.width =
                        isNaN(nilai)
                            ? "0%"
                            : Math.min(
                                Math.max(
                                    nilai,
                                    0
                                ),
                                100
                            ) + "%";

                }


                if (badge) {

                    badge.textContent =
                        tahap;

                }


                if (kondisiElement) {

                    kondisiElement.textContent =
                        kondisi;

                }


                if (tahapElement) {

                    tahapElement.textContent =
                        tahap;

                }


                if (hariElement) {

                    hariElement.textContent =
                        hari;

                }


                if (dapElement) {

                    dapElement.textContent =
                        dap;

                }


                if (sensorElement) {

                    sensorElement.textContent =
                        sensor;

                }

                if (moistureElement) {
                    moistureElement.textContent =
                        formatLSTMSensor(soilMoisture, "%");
                }

                if (temperatureElement) {
                    temperatureElement.textContent =
                        formatLSTMSensor(temperature, "°C");
                }

                if (adviceElement) {
                    adviceElement.textContent =
                        kondisi !== "Menunggu data" ? kondisi : "Menunggu data sensor dari Firebase.";
                }

            }
        );


    const emptyNote =
        document.getElementById(
            "lstmEmptyNote"
        );


    if (emptyNote) {

        emptyNote.textContent =
            "Hasil prediksi LSTM berhasil diperbarui.";

    }

    renderGrafikKematanganLSTM();

}


window.updateLSTMData =
    updateLSTMData;


if (btnRefreshLSTM) {

    btnRefreshLSTM.addEventListener(
        "click",
        function () {
            const emptyNote =
                document.getElementById(
                    "lstmEmptyNote"
                );

            const age = Number(umurLSTMHari && umurLSTMHari.value);
            if (!Number.isInteger(age) || age < 1 || age > 365) {
                if (emptyNote) {
                    emptyNote.textContent = "Masukkan umur tanaman (HST) antara 1 dan 365 untuk menjalankan prediksi.";
                }
                if (umurLSTMHari) umurLSTMHari.focus();
                return;
            }

            if (emptyNote) {
                emptyNote.textContent = lstmPredictionData
                    ? "Data prediksi terakhir ditampilkan. Model/backend belum menyediakan permintaan prediksi baru."
                    : "Prediksi belum tersedia: hubungkan model LSTM/backend untuk memproses data sensor.";
            }
            renderGrafikKematanganLSTM();
            console.log(
                "Permintaan prediksi LSTM ditampilkan; backend model belum terhubung."
            );

        }
    );

}


// ==========================================================
// 22. GRAFIK PREDIKSI
// ==========================================================

const grafikPrediksi =
    document.getElementById(
        "grafikPrediksi"
    );


let chartPrediksi = null;


if (grafikPrediksi) {

    chartPrediksi =
        new Chart(
            grafikPrediksi,
            {

                type: "line",

                data: {

                    labels: [],

                    datasets: [
                        {

                            label:
                                "Prediksi Kematangan",

                            data: [],

                            borderColor:
                                "#4d83ee",

                            backgroundColor:
                                "rgba(77,131,238,0.12)",

                            fill: true,

                            tension: 0.4,

                            borderWidth: 2,

                            pointRadius: 3

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    }

                }

            }
        );

}


// ==========================================================
// 23. CNN - UPLOAD FOTO
// ==========================================================

const uploadFoto =
    document.getElementById(
        "uploadFoto"
    );


const previewGambar =
    document.getElementById(
        "previewGambar"
    );


const hasilDeteksi =
    document.getElementById(
        "hasilDeteksi"
    );

const previewAsliKosong = document.getElementById("previewAsliKosong");
const previewSegmentasiKosong = document.getElementById("previewSegmentasiKosong");
const segmentasiGambar = document.getElementById("segmentasiGambar");
const hapusGambarCNN = document.getElementById("hapusGambarCNN");
const statusPrediksiCNN = document.getElementById("statusPrediksiCNN");
const statusHamaCNN = document.getElementById("statusHamaCNN");
const lebarDaunCNN = document.getElementById("lebarDaunCNN");
const catatanPrediksiCNN = document.getElementById("catatanPrediksiCNN");
const hasilHamaCNN = document.getElementById("hasilHamaCNN");
let cnnImageUrl = null;

function gambarGrafikKematangan() {
    const canvas = document.getElementById("grafikKematanganCNN");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.scale(ratio, ratio);
    context.clearRect(0, 0, width, height);

    const left = 43;
    const right = width - 8;
    const top = 10;
    const bottom = height - 31;
    context.font = "12px Arial";
    context.textAlign = "right";
    context.textBaseline = "middle";

    for (let value = 0; value <= 100; value += 10) {
        const y = bottom - (bottom - top) * value / 100;
        context.beginPath();
        context.strokeStyle = "rgba(130, 150, 140, 0.18)";
        context.moveTo(left, y);
        context.lineTo(right, y);
        context.stroke();
        context.fillStyle = getComputedStyle(document.body).getPropertyValue("--muted").trim();
        context.fillText(`${value}%`, left - 7, y);
    }

    const labels = ["Masa Pertumbuhan", "Mendekati Panen", "Siap Panen"];
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillStyle = getComputedStyle(document.body).getPropertyValue("--muted").trim();
    labels.forEach((label, index) => {
        const x = left + (right - left) * (index + 0.5) / labels.length;
        context.fillText(label, x, bottom + 10);
    });
}

function gambarSegmentasi(image) {
    if (!segmentasiGambar) return null;

    const maxDimension = 1000;
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const source = document.createElement("canvas");
    source.width = width;
    source.height = height;

    const sourceContext = source.getContext("2d", { willReadFrequently: true });
    const outputContext = segmentasiGambar.getContext("2d");
    if (!sourceContext || !outputContext) {
        throw new Error("Browser tidak dapat memproses gambar ini.");
    }

    sourceContext.drawImage(image, 0, 0, width, height);
    const pixels = sourceContext.getImageData(0, 0, width, height);
    const output = outputContext.createImageData(width, height);
    let minX = width;
    let maxX = -1;

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const index = (y * width + x) * 4;
            const red = pixels.data[index];
            const green = pixels.data[index + 1];
            const blue = pixels.data[index + 2];
            let color = null;

            if (green > 45 && green > red * 1.08 && green > blue * 1.03) {
                color = [49, 199, 121];
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            } else if (red > 90 && green > 80 && red > blue * 1.2 && green > blue * 1.15 && red < green * 1.25) {
                color = [230, 198, 59];
            } else if (red > 75 && red > green * 1.45 && red > blue * 1.3) {
                color = [226, 82, 82];
            } else if (red > 55 && red > green * 1.25 && green > blue * 1.12) {
                color = [193, 122, 53];
            } else if (blue > 55 && blue > red * 1.2 && blue > green * 1.1) {
                color = [55, 169, 218];
            }

            if (color) {
                output.data[index] = color[0];
                output.data[index + 1] = color[1];
                output.data[index + 2] = color[2];
                output.data[index + 3] = 220;
            }
        }
    }

    segmentasiGambar.width = width;
    segmentasiGambar.height = height;
    outputContext.putImageData(output, 0, 0);
    return maxX >= minX ? Math.round((maxX - minX + 1) / scale) : null;
}

function bersihkanGambarCNN() {
    if (cnnImageUrl) {
        URL.revokeObjectURL(cnnImageUrl);
        cnnImageUrl = null;
    }

    if (uploadFoto) uploadFoto.value = "";
    if (previewGambar) {
        previewGambar.removeAttribute("src");
        previewGambar.style.display = "none";
    }
    if (previewAsliKosong) previewAsliKosong.hidden = false;
    if (segmentasiGambar) {
        segmentasiGambar.style.display = "none";
        const context = segmentasiGambar.getContext("2d");
        if (context) context.clearRect(0, 0, segmentasiGambar.width, segmentasiGambar.height);
    }
    if (previewSegmentasiKosong) previewSegmentasiKosong.hidden = false;
    if (hasilDeteksi) hasilDeteksi.textContent = "Belum ada gambar.";
    if (lebarDaunCNN) lebarDaunCNN.textContent = "-- px";
    if (statusPrediksiCNN) statusPrediksiCNN.textContent = "Belum ada gambar";
    if (statusHamaCNN) statusHamaCNN.textContent = "Belum ada gambar";
    if (catatanPrediksiCNN) catatanPrediksiCNN.textContent = "Persentase akan tampil setelah model CNN terhubung.";
    if (hasilHamaCNN) hasilHamaCNN.textContent = "Hasil deteksi akan tampil setelah gambar diproses.";
    if (hapusGambarCNN) hapusGambarCNN.hidden = true;
}

if (uploadFoto) {
    uploadFoto.addEventListener("change", function () {
        const file = this.files && this.files[0];
        if (!file) return;

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("Silakan pilih gambar JPG atau PNG.");
            bersihkanGambarCNN();
            return;
        }

        if (cnnImageUrl) URL.revokeObjectURL(cnnImageUrl);
        cnnImageUrl = URL.createObjectURL(file);

        const image = new Image();
        image.onload = function () {
            try {
                if (previewGambar) {
                    previewGambar.src = cnnImageUrl;
                    previewGambar.style.display = "block";
                }
                if (previewAsliKosong) previewAsliKosong.hidden = true;

                const measuredWidth = gambarSegmentasi(image);
                if (segmentasiGambar) segmentasiGambar.style.display = "block";
                if (previewSegmentasiKosong) previewSegmentasiKosong.hidden = true;
                if (lebarDaunCNN) {
                    lebarDaunCNN.textContent = measuredWidth ? `${measuredWidth} px` : "-- px";
                }
                if (hasilDeteksi) {
                    hasilDeteksi.textContent = measuredWidth
                        ? "Segmentasi warna selesai. Lebar objek hijau terukur dalam piksel."
                        : "Gambar dimuat, tetapi area hijau tidak terdeteksi.";
                }
                if (statusPrediksiCNN) statusPrediksiCNN.textContent = "Gambar dimuat";
                if (statusHamaCNN) statusHamaCNN.textContent = "Model belum terhubung";
                if (catatanPrediksiCNN) {
                    catatanPrediksiCNN.textContent = "Prediksi fase panen memerlukan model CNN terlatih yang belum terhubung ke aplikasi.";
                }
                if (hasilHamaCNN) {
                    hasilHamaCNN.textContent = "Segmentasi warna tersedia. Klasifikasi hama & penyakit memerlukan model terlatih.";
                }
                if (hapusGambarCNN) hapusGambarCNN.hidden = false;
            } catch (error) {
                console.error("Gagal memproses gambar CNN:", error);
                if (hasilDeteksi) hasilDeteksi.textContent = error.message;
                bersihkanGambarCNN();
                if (hasilDeteksi) hasilDeteksi.textContent = error.message;
            }
        };
        image.onerror = function () {
            if (hasilDeteksi) hasilDeteksi.textContent = "Gambar tidak dapat dibuka. Coba pilih file JPG atau PNG lain.";
            bersihkanGambarCNN();
            if (hasilDeteksi) hasilDeteksi.textContent = "Gambar tidak dapat dibuka. Coba pilih file JPG atau PNG lain.";
        };
        image.src = cnnImageUrl;
    });
}

if (hapusGambarCNN) {
    hapusGambarCNN.addEventListener("click", bersihkanGambarCNN);
}

gambarGrafikKematangan();
window.addEventListener("resize", gambarGrafikKematangan);


// ==========================================================
// SELESAI
// ==========================================================

console.log(
    "SeladaDar Script berhasil dimuat."
);


// ==========================================================
// 24. FIREBASE REALTIME DATABASE - REST API
// Koneksi menggunakan URL database saja (tanpa Firebase SDK).
// Interface dan style asli tidak diubah.
// ==========================================================

const FIREBASE_DATABASE_URL =
    "https://selada-a9428-default-rtdb.asia-southeast1.firebasedatabase.app/";

// Polling REST API untuk membaca perubahan data terbaru.
// Ubah interval bila diperlukan (dalam milidetik).
const FIREBASE_POLL_INTERVAL = 3000;

// Path default yang didukung:
// /sensor/latest.json atau data sensor langsung pada root database.
// Pembacaan root membantu menyesuaikan beberapa bentuk struktur database.
let firebaseLastSensorSignature = "";
let firebaseLastLstmSignature = "";
let firebaseLastHistorySignature = "";
let firebaseReadInProgress = false;
let firebasePumpStatusReceived = false;

function firebaseCariObjekSensor(root) {
    if (!root || typeof root !== "object") return null;

    const candidates = [
        root.sensor?.latest,
        root.sensor?.current,
        root.sensor?.data,
        root.latest,
        root.current,
        root.data?.latest,
        root.data?.sensor,
        root.readings?.latest,
        root
    ];

    const aliases = [
        "suhu", "temperature", "suhuUdara",
        "kelembapanUdara", "humidity", "airHumidity",
        "kelembapanTanah", "soilMoisture", "soil_moisture",
        "moisture"
    ];

    for (const candidate of candidates) {
        if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
        if (aliases.some(key => candidate[key] !== undefined && candidate[key] !== null)) {
            return candidate;
        }
    }

    return null;
}

function firebaseNormalisasiSensor(raw) {
    if (!raw) return null;

    const ambil = (...keys) => {
        for (const key of keys) {
            if (raw[key] !== undefined && raw[key] !== null && raw[key] !== "") {
                const value = Number(raw[key]);
                if (Number.isFinite(value)) return value;
            }
        }
        return undefined;
    };

    const result = {
        suhu: ambil("suhu", "temperature", "suhuUdara", "temp"),
        kelembapanUdara: ambil("kelembapanUdara", "humidity", "airHumidity", "kelembapan_udara"),
        kelembapanTanah: ambil("kelembapanTanah", "soilMoisture", "soil_moisture", "moisture", "kelembapan_tanah")
    };

    if (
        result.suhu === undefined &&
        result.kelembapanUdara === undefined &&
        result.kelembapanTanah === undefined
    ) return null;

    return result;
}

function firebaseAmbilStatusPompa(root, rawSensor) {
    const candidates = [
        root?.control?.pompa,
        root?.kontrol?.pompa,
        root?.pompa,
        root?.pump,
        rawSensor?.pompa,
        rawSensor?.pump,
        rawSensor?.statusPompa
    ];

    for (const value of candidates) {
        if (value === undefined || value === null) continue;

        const status = typeof value === "object"
            ? (value.status ?? value.state ?? value.on ?? value.isOn)
            : value;

        if (typeof status === "boolean") return status;
        if (typeof status === "number") return status !== 0;

        if (typeof status === "string") {
            const normal = status.trim().toLowerCase();
            if (["on", "nyala", "aktif", "true", "1"].includes(normal)) return true;
            if (["off", "mati", "nonaktif", "false", "0"].includes(normal)) return false;
        }
    }
    return null;
}

function firebaseAmbilTimestamp(raw) {
    const value = raw?.timestamp ?? raw?.time ?? raw?.waktu ?? raw?.createdAt ?? raw?.updatedAt;
    if (value === undefined || value === null) return new Date();

    if (typeof value === "number") {
        return new Date(value < 1000000000000 ? value * 1000 : value);
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function firebaseProsesHistory(root) {
    const source =
        root?.sensor?.history ??
        root?.history ??
        root?.riwayat ??
        root?.readings ??
        null;

    if (!source || typeof source !== "object") return;

    const entries = Array.isArray(source)
        ? source
        : Object.entries(source).map(([key, value]) => ({
            ...(value && typeof value === "object" ? value : {}),
            _firebaseKey: key
        }));

    if (!entries.length) return;

    const signature = JSON.stringify(entries.slice(-REALTIME_HISTORY_LIMIT));
    if (signature === firebaseLastHistorySignature) return;
    firebaseLastHistorySignature = signature;

    const mapped = entries.slice(-REALTIME_HISTORY_LIMIT).map(item => {
        const raw = item && typeof item === "object" ? item : {};
        const sensor = firebaseNormalisasiSensor(raw) || {};
        const pump = firebaseAmbilStatusPompa({ pompa: raw.pompa ?? raw.pump }, raw);

        return {
            timestamp: firebaseAmbilTimestamp(raw),
            kelembapanTanah: sensor.kelembapanTanah ?? null,
            suhu: sensor.suhu ?? null,
            kelembapanUdara: sensor.kelembapanUdara ?? null,
            pompa: pump === null ? (raw.pompa ?? raw.pump ?? "--") : (pump ? "ON" : "OFF"),
            status: (
                sensor.kelembapanTanah !== undefined &&
                sensor.kelembapanTanah >= BATAS_POMPA_ON &&
                sensor.kelembapanTanah <= BATAS_POMPA_OFF
            ) ? "Normal" : "Perlu perhatian"
        };
    });

    realtimeHistory.splice(0, realtimeHistory.length, ...mapped);
    realtimeChartHistory.splice(0, realtimeChartHistory.length, ...mapped.slice(-REALTIME_CHART_HISTORY_LIMIT));
    renderPembacaanRealTime();
}

function firebaseProsesLSTM(root) {
    const candidates = [
        root?.lstm,
        root?.prediksi?.lstm,
        root?.predictions?.lstm,
        root?.ai?.lstm
    ];

    const data = candidates.find(item =>
        item && typeof item === "object" && Array.isArray(item.predictions)
    );

    if (!data) return;

    const signature = JSON.stringify(data);
    if (signature === firebaseLastLstmSignature) return;
    firebaseLastLstmSignature = signature;
    updateLSTMData(data);
}

async function firebaseBacaDatabase() {
    if (firebaseReadInProgress) return;
    firebaseReadInProgress = true;

    try {
        const response = await fetch(`${FIREBASE_DATABASE_URL}/.json`, {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const root = await response.json();
        if (!root || typeof root !== "object") {
            console.info("Firebase terhubung, tetapi database belum berisi data sensor.");
            return;
        }

        const rawSensor = firebaseCariObjekSensor(root);
        const sensor = firebaseNormalisasiSensor(rawSensor);

        if (sensor) {
            const signature = JSON.stringify(sensor);
            if (signature !== firebaseLastSensorSignature) {
                firebaseLastSensorSignature = signature;
                updateSensorData(sensor);
            }
        }

        const statusPompa = firebaseAmbilStatusPompa(root, rawSensor);
        if (statusPompa !== null) {
            firebasePumpStatusReceived = true;
            pompaMenyala = statusPompa;
            updateTampilanPompa();
        } else if (!firebasePumpStatusReceived) {
            // Jangan menampilkan status pompa hasil simulasi lokal sebagai status perangkat.
            const statusDetail = document.getElementById("statusPompaDetail");
            const indikator = document.getElementById("indikatorPompa");
            const keterangan = document.getElementById("keteranganModePompa");
            if (statusDetail) statusDetail.textContent = "Menunggu status pompa dari ESP32";
            if (indikator) indikator.textContent = "Status belum diterima";
            if (keterangan) keterangan.textContent = "Status pompa akan tampil setelah ESP32 mengirimkannya ke Firebase.";
        }

        firebaseProsesHistory(root);
        firebaseProsesLSTM(root);

        console.info("Data Firebase berhasil dibaca.");
    } catch (error) {
        console.error("Gagal membaca Firebase Realtime Database:", error);
    } finally {
        firebaseReadInProgress = false;
    }
}

// Mulai membaca database setelah seluruh fungsi interface tersedia.
firebaseBacaDatabase();
setInterval(firebaseBacaDatabase, FIREBASE_POLL_INTERVAL);

// Fungsi dapat dipanggil dari console browser untuk tes manual.
window.firebaseBacaDatabase = firebaseBacaDatabase;


fetch("https://fifagama.herokuapp.com/fifa19/0/16")
    .then(r => {
        return r.json();
    })
    .then(r => {
        let string = "";
        for (i in r) {
            string += getHTML(r[i].data);
        }
        bundler(string);
        getCanvas(r);
    });

bundler = string => {
    const div = document.querySelector("tbody");
    div.innerHTML = string;
};

const getHTML = data => {
    return `
    <tr>
        <th scope="row"><img class="player__image" src="${data.Photo}" alt=""></th>
        <td>${data.Name}<br>${data.Position}</td>
        <td><img class="club__logo" src="${data["Club Logo"]}" alt=""> ${data.Club}</td>
        <td>${data.Overall} / ${data.Potential}</td>
    </tr>`;
};

function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

const getCanvas = r => {
    const charts = ["Overall", "Potential", "Value", "Wage", "Age"];
    for (i in charts) {
        const color = getRandomRgb();
        const label = r.map(e => e.data.Name);
        const data = r.map(e => {
            let value = e.data[charts[i]];
            if (parseFloat(value)) return value;
            return Number(value.substring(1, value.length - 1));
        });

        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<canvas id="chart${charts[i]}"></canvas>`;
        const body = document.querySelector(".charts");
        body.appendChild(newDiv);

        const element = document
            .getElementById(`chart${charts[i]}`)
            .getContext("2d");

        new Chart(element, {
            type: "line",
            data: {
                labels: label,
                datasets: [
                    {
                        label: charts[i],
                        data: data,
                        backgroundColor: color
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                }
            }
        });
    }
};

//initialisation des variables globales
var limite = 10;
var gold = 0;
var gps = 0;
var multiple_click = 1;
var show = 0;
var stage = 0;
var progress_stage = 0;
var click = 0;
var extra = 1;
var charge = 0;
var timer = 0;
var gold_t = 0;
var status = "pret";
var reset_action = setTimeout(function() {action()}, 1000);
var reset_recharge = setTimeout(function() {recharge()}, 1000);
var minions = [
    { id: 1, name: "Mineur dépressif", cost: 10, gps: 0.1, owned: 0 },
    { id: 2, name: "Mineur enjoué", cost: 100, gps: 1, owned: 0 },
    { id: 3, name: "Mineur dopé", cost: 500, gps: 5, owned: 0 }
];

var achievement = [
    { id: 1, name: "Déprime général", activate: 0, condition: "Posséder 20 Mineurs dépressifs" },
    { id: 2, name: "Le travail des gens heureux", activate: 0, condition: "Posséder 10 Mineurs enjoués" },
    { id: 3, name: "C'est au moins légal?", activate: 0, condition: "Posséder 1 Mineurs dopés" },
    { id: 4, name: "Entreprise", activate: 0, condition: "Posséder 30 mineurs" },
    { id: 5, name: "Foreuse", activate: 0, condition: "Avoir atteint l'étage 25" },
    { id: 6, name: "Acharné", activate: 0, condition: "Avoir cliquer 100 fois" },
    { id: 7, name: "Amasseur", activate: 0, condition: "Avoir récolté en tout 500 golds" },
    { id: 8, name: "Ouvrier d'enfer", activate: 0, condition: "Avoir atteint 10 gps" },
    { id: 9, name: "Entrepreneur née", activate: 0, condition: "Avoir fait tous les achievements" }
]

//initialise l'affichage de la boutique qui dépendent de minions
function initiate() {
    initiate1();
    initiate2();
    initiate3();
}

function initiate1() {
    document.querySelector("#minion1_name").innerHTML = minions[0].name;
    document.querySelector("#minion1_cost").innerHTML = minions[0].cost + " golds";
    document.querySelector("#minion1_gps").innerHTML = minions[0].gps + " gps";
    document.querySelector("#minion1_owned").innerHTML = minions[0].owned + " possédé";
}

function initiate2() {
    document.querySelector("#minion2_name").innerHTML = minions[1].name;
    document.querySelector("#minion2_cost").innerHTML = minions[1].cost + " golds";
    document.querySelector("#minion2_gps").innerHTML = minions[1].gps + " gps";
    document.querySelector("#minion2_owned").innerHTML = minions[1].owned + " possédé";
}

function initiate3() {
    document.querySelector("#minion3_name").innerHTML = minions[2].name;
    document.querySelector("#minion3_cost").innerHTML = minions[2].cost + " golds";
    document.querySelector("#minion3_gps").innerHTML = minions[2].gps + " gps";
    document.querySelector("#minion3_owned").innerHTML = minions[2].owned + " possédé";
}

//Calcule la somme des gps des minions possédés et l'ajoute à la variable gps au centième près
function getGPS(element, index, array) {
    gps = element.owned * element.gps + gps;
    gps = Math.ceil(gps * 100)/100;
}

//Affiche le gps total
function displayGPS() {
    gps = gps * extra;
    select = document.querySelector("#mission");
    select.innerHTML = gps;
    displayGolds();
}

//Ajoute à gold une valeur à chaque clic
function addGold(x) {
    click = click + 1;
    localStorage.setItem("click", click);
    gold = gold + x * multiple_click * extra;
    progress_stage = progress_stage + x * multiple_click * extra;
    gold_t = gold_t + x * multiple_click * extra;
    displayGolds();
}

//Ajoute à gold une valeur à chaque seconde. Ne prend pas en compte le multiplicateur de clic
function addGol_d(x) {
    gold = gold + x;
    progress_stage = progress_stage + x;
    gold_t = gold_t + x;
    displayGolds();
}

//Affiche la quantité total de gold
function displayGolds() {
    var h1 = document.querySelector("#score");    
    gold = Math.ceil(gold * 100)/100;
    h1.innerHTML = gold;
    gold_t = gold;
    calculetage();
    check();
    localStorage.setItem("gold", gold);
}

function calculetage() {
    while (progress_stage >= limite) {       
        progress_stage = progress_stage - limite;
        localStorage.setItem("progress_stage", progress_stage);
        stage = stage + 1;
        localStorage.setItem("stage", stage);
        var modulo = stage % 10;
        if (modulo == 0) {
            limite = limite + 10;
            localStorage.setItem("limite", limite);
        }
    }
    var select = document.querySelector("#stage");
    select.innerHTML = stage;
}

//Permetde verifier si le joueur à assez de gold pour acheter et met à jour les données après achat
function buyMinion(id) {
    for (var i = 0; i < 3; i++) {
        if (minions[i].id === id) {
            if (minions[i].cost <= gold) {
                gold = gold - minions[i].cost;
                minions[i].owned = minions[i].owned + 1;
                minions[i].cost = Math.ceil(minions[i].cost * 1.15 * 100)/100;
                UpGPS(i);
                UpClick();
                localStorage.setItem("minions", JSON.stringify(minions));
                gps = 0;
                minions.forEach(getGPS);
                check();
                displayGPS();
                initiate();
            }
        }
    }  
}

//Double la valeur de gps d'un minion après un certain seuil atteint
function UpGPS(i) {
    if (minions[i].owned == 25) {
        minions[i].gps = minions[i].gps * 2;
    }
    else if (minions[i].owned == 50) {
        minions[i].gps = minions[i].gps * 2;
    }
    else if (minions[i].owned == 100) {
        minions[i].gps = minions[i].gps * 2;
    }
    else if (minions[i].owned == 250) {
        minions[i].gps = minions[i].gps * 2;
    }
    else if (minions[i].owned == 1000) {
        minions[i].gps = minions[i].gps * 2;
    }
}

//Augmente la valeur du clic selon le nombre de minions possédés
function UpClick() {
    var total = 0;
    for (var i = 0; i < 3; i++) {
        total = minions[i].owned + total;
    }
    multiple_click = Math.floor(total / 50) + 1;
}

function check() {
    if (achievement[0].activate == 0 && minions[0].owned >= 20) {
        affich(0);
    }
    if (achievement[1].activate == 0 && minions[1].owned >= 10) {
        affich(1);
    }
    if (achievement[2].activate == 0 && minions[2].owned >= 1) {
        affich(2);
    }    
    var total = 0;
    for (var x = 0; x < 3; x++) {
        total = minions[x].owned + total;
    }
    if (achievement[3].activate == 0 && total >= 30) {
        affich(3);
    }
    if (achievement[4].activate == 0 && stage >= 25) {
        affich(4);
    }
    if (achievement[5].activate == 0 && click >= 100) {
        affich(5);
    }
    if (achievement[6].activate == 0 && gold_t >= 500) {
        affich(6);
    }
    var disp_gps = gps/extra;
    if (achievement[7].activate == 0 && disp_gps >= 10) {
        affich(7);
    }
    var finish = 1;
    for (var x = 0; x < 7; x++) {
        if (achievement[x].activate == 0) {
            finish = 0;
        }
    }
    if (achievement[8].activate == 0 && finish == 1) {
        setTimeout(function() {affich(8)}, 3000);
    }
    localStorage.setItem("achievement", JSON.stringify(achievement));
}

function affich(i) {
    achievement[i].activate = 1;
    select = document.querySelector("#name_ach");
    select.innerHTML = achievement[i].name + " Dévérouillé";
    if (show == 1) {
        stopaffich();
        affichall();
    }
    setTimeout(function(){ reset(); }, 3000);
}

function affichall() {
    if (show == 0) {
        for (var i = 0; i < 9; i++) {
            if (achievement[i].activate == 1) {
                var select = document.querySelector("liste");
                var test = document.createElement("div");
                test.style.background="#ccc";
                test.className= "group";
                select.appendChild(test);

                var child = document.createElement("h2");
                child.className = "succes";
                child.innerHTML = achievement[i].name;
                test.appendChild(child);

                select = document.querySelector("liste");
                var child = document.createElement("h4");
                child.className = "description";
                child.innerHTML = achievement[i].condition;
                test.appendChild(child);
            }
        }
        show = 1;
    } 
    else if (show == 1) {
        stopaffich();
    }
}

function stopaffich() {
    if (show == 1) {
        select = document.querySelector(".succes");
        if (select !== null) {
            select.innerHTML = "";
        }
        select = document.querySelector(".description");
        if (select !== null) {
            select.innerHTML = "";
        }
        select = document.querySelector("liste");
        deleted = document.querySelector(".group");
        while (deleted !== null) {
            select.removeChild(document.querySelector(".group"));
            deleted = document.querySelector(".group");
        }
        show = 0;
    }
}

function reset() {
    select = document.querySelector("#name_ach");
    select.innerHTML = "";
}

function buyExtra() {
    if (charge == 0) {
        charge = 1;
        localStorage.setItem("charge", charge);
        timer = 60;
        extra = 2;
        localStorage.setItem("extra", extra);
        gps = 0;
        minions.forEach(getGPS);
        displayGPS();
        action();
    }
}

function action() {
    var body = document.querySelector("#status");
    status = "en cours";
    body.innerHTML = status;
    localStorage.setItem("status", status);
    var body = document.querySelector("#timer");
    body.innerHTML = timer + " secondes";
    localStorage.setItem("timer", timer);
    timer = timer - 1;
    if (timer >= 0 ) {
        reset_action = setTimeout(function() {action()}, 1000);
    } else {
        status = "rechargement";
        localStorage.setItem("status", status);
        timer = 120;
        extra = 1;
        localStorage.setItem("extra", extra);
        gps = 0;
        minions.forEach(getGPS);
        displayGPS();
        recharge();
    }
}

function recharge() {
    var body = document.querySelector("#status");
    body.innerHTML = status;
    localStorage.setItem("status", status);
    var body = document.querySelector("#timer");
    body.innerHTML = timer + " secondes";
    localStorage.setItem("timer", timer);
    timer = timer - 1;
    if (timer >= 0 ) {
        setTimeout(function() {recharge()}, 1000);
    } else {
        ready();
    }
}

function ready() {
    charge = 0;
    localStorage.setItem("charge", charge);
    var body = document.querySelector("#status");
    status = "pret";
    body.innerHTML = status;
    localStorage.setItem("status", status);
    var body = document.querySelector("#timer");
    body.innerHTML = "";
}

function initiate_t() {
    if (localStorage.getItem("limite") !== null) {
        limite = localStorage.getItem("limite");
    }
    if (localStorage.getItem("gold") !== null) {
        gold = localStorage.getItem("gold");
        gold = parseInt(gold);
    }   
    if (localStorage.getItem("gps") !== null) {
        gps = localStorage.getItem("gps");
        gps = parseInt(gps);
    }
    if (localStorage.getItem("multiple_click") !== null) {
        multiple_click = localStorage.getItem("multiple_click");
        multiple_click = parseInt(multiple_click);
    }
    if (localStorage.getItem("stage") !== null) {
        stage = localStorage.getItem("stage");
        stage = parseInt(stage);
    }
    if (localStorage.getItem("progress_stage") !== null) {
        progress_stage = localStorage.getItem("progress_stage");
        progress_stage = parseInt(progress_stage);
    }
    if (localStorage.getItem("click") !== null) {
        click = localStorage.getItem("click");
        click = parseInt(click);
    }
    if (localStorage.getItem("extra") !== null) {
        extra = localStorage.getItem("extra");
        extra = parseInt(extra);
    }
    if (localStorage.getItem("charge") !== null) {
        charge = localStorage.getItem("charge");
        charge = parseInt(charge);
    }
    if (localStorage.getItem("timer") !== null) {
        timer = localStorage.getItem("timer");
        timer = parseInt(timer);
    }
    if (localStorage.getItem("minions") !== null) {
        minions = JSON.parse(localStorage.getItem("minions"));
    }
    if (localStorage.getItem("gold_t") !== null) {
        gold_t = localStorage.getItem("gold_t");
        gold_t = parseInt(gold_t);
    }
    if (localStorage.getItem("achievement") != null) {
        achievement = JSON.parse(localStorage.getItem("achievement"));
        check();
    }
    if (localStorage.getItem("status") !== null) {
        status = localStorage.getItem("status");
    }
    if (localStorage.getItem("charge") !== null) {
        charge = localStorage.getItem("charge");
        charge = parseInt(charge);
    }
    clearTimeout(reset_action);
    clearTimeout(reset_recharge);
    if (status == "en cours") {
        action()
    } 
    else if (status == "rechargement") {
        recharge()
    } else {
        ready();
    }
}

//Fonction qui va s'activer au lancement du programme
function fullinitiate() {
initiate_t();
initiate();
minions.forEach(getGPS);
displayGPS();
}

function new_game() {
    localStorage.removeItem("limite");
    localStorage.removeItem("gold");
    localStorage.removeItem("gps");
    localStorage.removeItem("multiple_click");
    localStorage.removeItem("stage");
    localStorage.removeItem("progress_stage");
    localStorage.removeItem("click");
    localStorage.removeItem("extra");
    localStorage.removeItem("charge");
    localStorage.removeItem("timer");
    localStorage.removeItem("minions");
    localStorage.removeItem("gold_t");
    localStorage.removeItem("achievement");
    localStorage.removeItem("timer");
    localStorage.removeItem("status");
    localStorage.removeItem("show");
    default_value();
}

function default_value() {
    limite = 10;
    gold = 0;
    gps = 0;
    multiple_click = 1;
    show = 1;
    stopaffich();
    show = 0;
    stage = 0;
    progress_stage = 0;
    click = 0;
    extra = 1;
    charge = 0;
    timer = 0;
    gold_t = 0;
    status = "pret"; 
    minions = [
        { id: 1, name: "Mineur dépressif", cost: 10, gps: 0.1, owned: 0 },
        { id: 2, name: "Mineur enjoué", cost: 100, gps: 1, owned: 0 },
        { id: 3, name: "Mineur dopé", cost: 500, gps: 5, owned: 0 }
    ];
    
    achievement = [
        { id: 1, name: "Déprime général", activate: 0, condition: "Posséder 20 Mineurs dépressifs" },
        { id: 2, name: "Le travail des gens heureux", activate: 0, condition: "Posséder 10 Mineurs enjoués" },
        { id: 3, name: "C'est au moins légal?", activate: 0, condition: "Posséder 1 Mineurs dopés" },
        { id: 4, name: "Entreprise", activate: 0, condition: "Posséder 30 mineurs" },
        { id: 5, name: "Foreuse", activate: 0, condition: "Avoir atteint l'étage 25" },
        { id: 6, name: "Acharné", activate: 0, condition: "Avoir cliquer 100 fois" },
        { id: 7, name: "Amasseur", activate: 0, condition: "Avoir récolté en tout 500 golds" },
        { id: 8, name: "Ouvrier d'enfer", activate: 0, condition: "Avoir atteint 10 gps" },
        { id: 9, name: "Entrepreneur née", activate: 0, condition: "Avoir fait tous les achievements" }
    ]
    fullinitiate();
}

fullinitiate();

setInterval(function() {addGol_d(gps)}, 1000);
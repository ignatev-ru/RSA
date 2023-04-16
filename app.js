"use strict";

let e, d, n, f;

function validatePrime(prime, nameOfPrime) {
    if (!isPrime(prime)) {
        alert("'" + nameOfPrime + "' не простое число");
        return false;
    }

    return true;
}

function isPrime(num) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num !== 1;
}

function calculate() {
    let p = document.getElementById("p").value.replace(/\D/g, '');
    let q = document.getElementById("q").value.replace(/\D/g, '');
    if (!(validatePrime(p, "p") && validatePrime(q, "q"))) return;
    n = p * q;
    document.getElementById("n").value = n;
    f = (p - 1) * (q - 1);
    document.getElementById("f").value = f;
    e = document.getElementById("e").value;
    d = document.getElementById("d").value;
    document.getElementById("private-key").innerHTML = "(" + e + "," + n + ")";
    document.getElementById("public-key").innerHTML = "(" + d + "," + n + ")";
}

function edit() {
    let p = document.getElementById("p")
    let q = document.getElementById("q")
    document.getElementById("p").value = "";
    document.getElementById("q").value = "";
    p.removeAttribute("readonly");
    q.removeAttribute("readonly");
    return p,q;
}

function encryptorChanged() {
    e = document.getElementById("e").value;
    d = document.getElementById("d").value;

    document.getElementById("private-key").innerHTML = "(" + e + "," + n + ")";
    document.getElementById("public-key").innerHTML = "(" + d + "," + n + ")";
}

function decryptorChanged() {
    e = document.getElementById("e").value;
    d = document.getElementById("d").value;
    document.getElementById("public-key").innerHTML = "(" + d + "," + n + ")";
}


let mySymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZабвгдежзийклмнопрстуфхцчшщъыьэюя ,.:!?";
let myTable = mySymbols.split('');

function encrypt() {
    e = document.getElementById("e").value;
    d = document.getElementById("d").value;
    let m = document.getElementById("message").value.split('');
    let decimal = [];
    for(let i = 0; i < m.length; i++){
        decimal.push(myTable.indexOf(m[i]))
    }
    document.getElementById("decimal").innerHTML = decimal;
    let encrypted = decimal.map(i => powerMod(i, e, n));
    document.getElementById("encrypted-msg").innerHTML = encrypted;
    document.getElementById("encrypted-msg-textbox").value = encrypted;
}

function decrypt() {
    let cipher = stringToNumberArray(document.getElementById("encrypted-msg-textbox").value);
    let decimal = cipher.map(i => powerMod(i, d, n));
    document.getElementById("decimal-decrypted").innerHTML = decimal;
    let message = "";
    for (let i = 0; i < decimal.length; i++) {
        message += myTable[decimal[i]];
    }
    document.getElementById("decrypted-msg").innerHTML = message;
}

function stringToNumberArray(str) {
    return str.split(",").map(i => parseInt(i));
}

// рассчет   base^exponent % modulus
function powerMod(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1)  //проверка на нечетность
            result = (result * base) % modulus;
        exponent = exponent >> 1; //Деление на 2 с округлением в меньшую сторону. Оператор >> сдвигает двоичное представление exponent на 1 бит вправо, отбрасывая сдвигаемые биты.
        base = (base * base) % modulus;
    }
    return result;
}       
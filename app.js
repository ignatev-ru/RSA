"use strict";

let e, d, n, f;

function validatePrime(prime, nameOfPrime) {
    if (!isPrime(prime)) {
        alert("'" + nameOfPrime + "' не простое число");
        return false;
    }

    return true;
}

function calculate() {
    let p = document.getElementById("p").value.replace(/\D/g, '');
    let q = document.getElementById("q").value.replace(/\D/g, '');
    if (!(validatePrime(p, "p") && validatePrime(q, "q"))) return;
    n = p * q;
    document.getElementById("n").value = n;

    f = (p - 1) * (q - 1);
    document.getElementById("f").value = f;

    let es = findEncryptionKeys(f, n);
    document.getElementById("e").value = es[0];
    document.getElementById("enKeyListSpan").innerHTML = es;
    encryptorChanged();
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

    let ds = findDecryptionKeys(e, f);
    ds.splice(ds.indexOf(e), 1);  //вырезаем из массива открытую экспоненту е
    d = ds[0];
    document.getElementById("d").value = d;
    document.getElementById("deKeyListSpan").innerHTML = " " + ds;

    document.getElementById("private-key").innerHTML = "(" + e + "," + n + ")";
    document.getElementById("public-key").innerHTML = "(" + d + "," + n + ")";
}

function decryptorChanged() {
    d = document.getElementById("d").value;
    document.getElementById("public-key").innerHTML = "(" + d + "," + n + ")";
}

function isPrime(num) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num !== 1;
}

function findEncryptionKeys(f, n) {
    let arr = [];
    for (let i = 2; i < f; i++) {
        if (isCoPrime(i, f) && isCoPrime(i, n))
            arr.push(i);
        if (arr.length > 5) break;
    }
    return arr;
}

function isCoPrime(a, b) {
    //находим разложение на множители
    let aFac = findFactors(a);
    let bFac = findFactors(b);
    //false, если есть хоть один общий множитель
    let result = aFac.every(x => bFac.indexOf(x) < 0);
    return result;
}

let hashtable = new Object();
function findFactors(num) {
    if (hashtable[num])
        return hashtable[num];

    let half = Math.floor(num / 2), 
        result = [],
        i, j;


    // Определяем инкремент j и начальное значение i
    num % 2 === 0 ? (i = 2, j = 1) : (i = 3, j = 2);

    for (i; i <= half; i += j) {
        num % i === 0 ? result.push(i) : false;
    }

    result.push(num); // В конце добавляем исходное число
    hashtable[num] = result;
    //console.log(hashtable);
    return result;
}

function findDecryptionKeys(e, f) {
    let ds = [];
    for (let x = f + 1; x < f + 1000000000; x++) {
        if (x * e % f === 1) {
            ds.push(x);
            if (ds.length > 5) return ds;
        }
    }
    return ds;
}


let mySymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZабвгдежзийклмнопрстуфхцчшщъыьэюя ,.:!?";
let myTable = mySymbols.split('');

function encrypt() {
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
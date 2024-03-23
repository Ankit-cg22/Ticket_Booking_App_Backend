require('dotenv').config()
const n = process.env.RSA_MODULUS, e = process.env.RSA_PUBLIC_KEY , d = process.env.RSA_PRIVATE_KEY;

function mod_pow(a , b , mod){
    if(b==0)return 1
    let ans = mod_pow(a , Math.floor(b/2) , mod);
    ans = (ans * ans) % mod 

    if(b%2 == 1) ans = (ans * a) % mod

    return ans

}

function RSA_encrypt(msg) {
    let encodedMsg = [];
    for (let i = 0; i < msg.length; i++) {
        encodedMsg.push(msg.charCodeAt(i));
    }
    let cipherText = encodedMsg.map(c => Number(mod_pow(c, e , n)));
    return cipherText;
}

function RSA_decrypt(cipherText) {
    let encodedMsg = cipherText.map(c => String.fromCharCode(Number(mod_pow(c, d , n))));
    let msg = encodedMsg.join("");
    return msg;
}

module.exports = {RSA_encrypt , RSA_decrypt}
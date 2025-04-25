<template>

<footer id="contacto">
    <div class="arriba">
        <div class="logo-footer">
            <img class="img-logo-footer" src="../assets/icon_user.png" alt="Logo">
        </div>
        <a href="#">
            <span>Volver arriba</span>
            <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5.5 5.5L18 10" fill="none" stroke="currentColor"></path>
            </svg>
        </a>
    </div>
    <div class="footer-content">
        <div class="footer-links">
            <ul>
                <li><a href="#">Política de privacidad</a></li>
                <li><a href="#">Política de cookies</a></li>
                <li><a href="#">Aviso legal</a></li>
                <li><a href="#">Condiciones de uso</a></li>
            </ul>
        </div>
        <div class="social-media">
            <ul>
                <li><a href=""><img class="social-img" src="../assets/facebook.png" alt="Facebook"></a></li>
                <li><a href=""><img class="social-img" src="../assets/twitter.png" alt="Twitter"></a></li>
                <li><a href=""><img class="social-img" src="../assets/instagram.png" alt="Instagram"></a></li>
            </ul>
        </div>
    </div>
    <div class="tag">
        <p>© 2025. Realizado Por Raul Galvez y Rafael Galvan</p>
    </div>
</footer>

</template>

<script>
export default {
    name: "FooterPage"
};
</script>

<style scoped>

/* FOOTER */

.footer-content {
    display: flex;
    justify-content: space-between;
    background-color: black;
    color: white;
    margin-top: 16px;
    align-items: center;
}

.footer-links {
    display: flex;
    flex-grow: 1;
    list-style: none;
    background-color: black;
    align-items: center;
    color: white;
    max-width: 65%;
}

.footer-links ul li a:hover {
    color: #808080;
}

.img-logo-footer {
    width: auto;
    height: 80px;
}

.social-media {
    align-items: center;
    list-style: none;
    max-width: 30%;
}

.footer-links ul {
    display: inline-flex;
    flex-flow: wrap;
    list-style: none;
    background-color: black;
    color: white;
    margin-top: 16px;
}

footer {
    padding: 40px;
    background-color: black;
    color: white;
}

.arriba {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 30px;
}

svg {
    transform: rotate(180deg);
}

.arriba a span {
    margin-right: 10px;
}

.arriba a {
    display: inline-flex;
    height: fit-content;
    align-items: center;
    text-decoration: none;
    color: white;
}

.arriba a:hover {
    color: #808080;
}

.tag {
    border-top: 1px solid #333333;
    margin-top: 40px;
}

.tag p {
    margin-top: 40px;
    font-size: small;
}

.footer-content ul {
    list-style: none;
    display: flex;
    gap: 15px;
}

.social-img {
    width: auto;
    height: 24px;
}

</style>
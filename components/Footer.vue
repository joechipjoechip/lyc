<script setup>
import { footerWording } from '@/assets/data/footer';
</script>

<template>
    <section class="footer-wrapper">
        <div class="footer-inner">
            
            <section class="socials-wrapper">
                <a  v-for="item in footerWording.socials" :key="item.name"
                    class="socials-item"
                    :href="item.link"
                    target="_blank"
                >
                    <img :src="`/images/logos/${item.name}.jpg`" :alt="'logo' + item.name" />
                </a>
            </section>

            <img class="logo-lyc" src="/images/core/logo-chrome.png" alt="logo lyc">

            <p class="copyright">Copyright 2024 by LOOT YOUR CITY</p>

            <!-- <section class="legal">
                <a href="#">Privacy</a>
                <a href="#">Terms of service</a>
            </section> -->

            <!-- <MicroTechnoPack class="technospack"/> -->

        </div>
    </section>
</template>

<style lang="scss" scoped>

.footer {
    &-wrapper {
        padding-bottom: 3rem;
        margin-top: $dividerVertical * 3;
        
        @media #{$mobile} {
            margin-top: $dividerVertical * 1.5;
        }
    }
}

.socials {
    &-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        
    }

    &-item {
        display: block;
        border-radius: 1rem;
        overflow: hidden;
        width: 3.5rem;
        height: 3.5rem;
        
        margin: 0 1rem;
        
        @media #{$mobile} {
            width: 5rem;
            height: 5rem;
            margin: 0 1.5rem;
        }

        &:first-of-type {
            margin-left: 0;
        }
        &:last-of-type {
            margin-right: 0;
        }

        img {
            width: 100%;
        }
    }
}

.logo-lyc {
    display: block;
    margin: 0 auto;
    width: 5rem;
    margin-top: 2.5rem;
}

.copyright,
.legal {
    
    text-align: center;
    margin-top: 3rem;
    font-size: var(--font-size-medium);
    text-transform: uppercase;

    @media #{$mobile} {
        font-size: var(--font-size-bigest) !important;
    }
}

.copyright {
    font-family: 'Mada Light';
}

.legal {
    margin-top: 1rem;
    font-weight: 900;
    font-size: var(--font-size-medium);
    
    a {
        margin: 0 1rem;
        &:first-of-type {
            margin-left: 0;
        }
        &:last-of-type {
            margin-right: 0;
        }
    }
}

.technospack {
    position: absolute;
    bottom: 5rem;
    right: 2rem;
    border: solid 1px green;
    width: 30rem;
}
</style>

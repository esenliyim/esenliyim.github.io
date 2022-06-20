import {defineUserConfig} from "vuepress";
import {gungnirTheme} from "vuepress-theme-gungnir";
import {chartPlugin} from 'vuepress-plugin-chart';
import {readingTimePlugin} from '@renovamen/vuepress-plugin-reading-time';
import {mdPlusPlugin} from '@renovamen/vuepress-plugin-md-plus';

import {navbar, sidebar} from './configs'

export default defineUserConfig({
    base: "/",
    head: [
        ["meta", {name: "application-name", content: "Cahil Guvenlik"}],
        ["meta", {name: "apple-mobile-web-app-title", content: "Cahil Guvenlik"}],
        [
            "meta",
            {name: "apple-mobile-web-app-status-bar-style", content: "black"}
        ],
    ],
    title: "Cahil Güvenlik",
    description: "Welcome welcome",
    plugins: [
        chartPlugin(),
        readingTimePlugin({
            excludeCodeBlock: true,
            wordsPerMinuteEN: 220
        }),
        mdPlusPlugin({
            all: true,
        })
    ],
    theme: gungnirTheme({
        lastUpdated: false,
        navbarTitle: "$ ~",
        // docsDir: "docs",
        personalInfo: {
            name: "Emre Şenliyim",
            avatar: "/img/avatar.jpg",
            description: "I don't want 250g of olives",
            sns: {
                github: 'esenliyim',
                email: 'esenliyim@gmail.com',
                letterboxd: {
                    icon: 'co-letterboxd',
                    // icon: 'https://a.ltrbxd.com/logos/letterboxd-decal-dots-pos-mono-500px.png',
                    link: 'https://letterboxd.com/cahilg'
                }
            }
        },
        home: '/',
        homeHeaderImages: [
            // red mars thing
            {
                "path": "/img/home-bg/wp1.jpg",
                "mask": "rgba(40, 57, 101, .4)"
            },
            // image 2
            {
                "path": "/img/home-bg/wp2.webp",
                "mask": "rgba(40, 57, 101, .4)"
            },
        ],
        catalog: true,
        blogNumPerPage: 20,
        locales: {
            "/": {
                navbar: navbar.en,
                sidebar: sidebar.en
            }
        },
        footer: `
             &copy; <a href="https://github.com/esenliyim" target="_blank">Emre Şenliyim</a> 2022
            <br>
             Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> &
            <a href="https://github.com/esenliyim/vuepress-theme-gungnir" target="_blank">Gungnir</a>
        `,
        pages: {
            // tags page
            tags: {
                // optional: subtitle of tags page
                subtitle: 'Hey! Here is tags page!',

                // optional: paths to and masks of the tags page cover images
                bgImage: {
                    path: '/img/pages/tags.jpg',
                    mask: 'rgba(211, 136, 37, .5)'
                }
            },

            // links page
            links: {
                // optional: subtitle of links page
                subtitle: 'Link to other places that have something to do with me in one way, shape, or form',

                // optional: paths to and masks of the links page cover images
                bgImage: {
                    path: '/img/pages/links.webp',
                    mask: 'rgba(64, 118, 190, 0.5)',
                }
            }
        }
    }),
    markdown: {
        extractHeaders: {
            level: [2, 3]
        },
        code: {
            lineNumbers: 5,
            preWrapper: true,
        }
    },
})
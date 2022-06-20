import {defineClientConfig} from "@vuepress/client";
import {addIcons} from 'oh-vue-icons';

import {
    FaSatelliteDish,
    RiGithubLine,
    FaTag,
    IoHomeSharp,
    CoLetterboxd,
} from 'oh-vue-icons/icons';

addIcons(
    FaSatelliteDish,
    RiGithubLine,
    FaTag,
    IoHomeSharp,
    CoLetterboxd,
);

export default defineClientConfig({})
import gulp from 'gulp';
import config from './gulp/config';
import clean from './gulp/tasks/clean';
import server from './gulp/tasks/server';
import { scriptsBuild, scriptsWatch } from './gulp/tasks/scripts';
import { pageBuild, pageWatch } from './gulp/tasks/pages';
import { styleBuild, styleWatch } from './gulp/tasks/styles';
import { fontsBuild, fontsWatch } from './gulp/tasks/fonts';
import { imagesBuild, imagesWatch } from './gulp/tasks/images';
import { spritesBuild, spritesWatch } from './gulp/tasks/sprites';
import { vendorScriptsBuild, vendorScriptsWatch } from './gulp/tasks/scripts-vendor';
import { vendorStyleBuild, vendorStyleWatch } from './gulp/tasks/styles-vendor';
import { assetsBuild, assetsWatch } from './gulp/tasks/assets';

config.setEnvironment();

export const build = gulp.series(
  clean,
  fontsBuild,
  spritesBuild,
  gulp.parallel(
    assetsBuild,
    pageBuild,
    imagesBuild,
    scriptsBuild,
    vendorScriptsBuild,
    styleBuild,
    vendorStyleBuild,
  ),

);

export const watch = gulp.series(
  build,
  server,
  gulp.parallel(
    scriptsWatch,
    pageWatch,
    imagesWatch,
    spritesWatch,
    vendorScriptsWatch,
    styleWatch,
    vendorStyleWatch,
    fontsWatch,
    assetsWatch,
  ),
);

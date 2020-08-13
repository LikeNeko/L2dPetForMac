# wget https://unpkg.com/element-ui/lib/index.js;
# mv ./index.js ./app/renderer/js/element_ui.js;
# wget https://unpkg.com/vue/dist/vue.js;
# mv ./vue.js ./app/renderer/js/vue.js;
# wget https://cdn.jsdelivr.net/npm/vue-resource@1.5.1 ;
# mv ./vue-resource@1.5.1 ./app/renderer/js/vue-http.js;
 wget https://unpkg.com/element-ui/lib/theme-chalk/index.css ;
sed -i '' 's/fonts\/element-icons.woff/\.\.\/fonts\/element-icons.woff/' ./index.css;
sed -i '' 's/fonts\/element-icons.ttf/\.\.\/fonts\/element-icons.ttf/' ./index.css;
 mv index.css app/renderer/css/element-ui.css;

 wget https://unpkg.com/element-ui/lib/theme-chalk/fonts/element-icons.woff ;
 mv element-icons.woff app/renderer/fonts/element-icons.woff;

 wget https://unpkg.com/element-ui/lib/theme-chalk/fonts/element-icons.ttf ;
 mv element-icons.ttf app/renderer/fonts/element-icons.ttf;
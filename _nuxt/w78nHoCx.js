function t({route:a,redirect:r}){const o=a.params.id;if(!o)return r("/");console.log(`Переход на маршрут с ID: ${o}`)}export{t as default};

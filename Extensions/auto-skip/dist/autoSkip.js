!async function(){for(;!Spicetify.React||!Spicetify.ReactDOM;)await new Promise(e=>setTimeout(e,10));var o,i,u,e;i=class{static getToken(){return Spicetify.Platform.AuthorizationAPI._state.token.accessToken}static async getTrackDetails(e){return fetch("https://api.spotify.com/v1/tracks/"+e,{headers:{Authorization:"Bearer "+await i.getToken()}}).then(e=>e.json())}static async getTrackFeatures(e){return fetch("https://api.spotify.com/v1/audio-features/"+e,{headers:{Authorization:"Bearer "+await i.getToken()}}).then(e=>e.json())}static async searchSpotify(e,t="track"){return fetch(`https://api.spotify.com/v1/search?q=${e}&type=${t}&limit=15`,{headers:{Authorization:"Bearer "+await i.getToken()}}).then(e=>e.json())}static async addTrackToQueue(e){var e=[e].map(e=>({uri:e})),t=await Spicetify.Platform.PlayerAPI.getQueue();0<t.queued.length?(t={uri:t.queued[0].uri,uid:t.queued[0].uid},await Spicetify.Platform.PlayerAPI.insertIntoQueue(e,{before:t}).catch(e=>{console.error("Failed to add to queue",e)})):await Spicetify.addToQueue(e).catch(e=>{console.error("Failed to add to queue",e)})}},u={skipAcoustic:{menuTitle:"Acoustic Songs",check:t=>["acoustic","stripped","unplugged"].some(e=>t.name.toLowerCase().includes(e))||.85<t?.features?.acousticness,callback:async e=>{await s(a(e.name)+" artist:"+e.artists[0].name)}},skipInstrumental:{menuTitle:"Instrumental Songs",check:e=>e.name.toLowerCase().includes("instrumental")||.4<e?.features?.instrumentalness},skipRemix:{menuTitle:"Remix Songs",check:e=>e.name.toLowerCase().includes("remix"),callback:async e=>s(a(e.name)+" artist:"+e.artists[0].name)},skipLive:{menuTitle:"Live Songs",check:t=>["- live","live version","(live)"].some(e=>t.name.toLowerCase().includes(e))||.8<t?.features?.liveness,callback:async e=>s(a(e.name)+" artist:"+e.artists[0].name)},skipRadio:{menuTitle:"Radio/Censored songs",check:e=>e.name.toLowerCase().includes("radio edit"),callback:async e=>s(a(e.name)+" artist:"+e.artists[0].name)},skipExplicit:{menuTitle:"Explicit Songs",check:e=>!0===e?.explicit,callback:async e=>s(a(e.name)+" artist:"+e.artists[0].name)},skipChristmas:{menuTitle:"Christmas Songs",check:t=>["xmas","christmas","jingle","mistletoe","merry","santa","feliz","navidad"].some(e=>t.name.toLowerCase().includes(e))},skipLiked:{menuTitle:"Liked Songs",check:(e,t)=>null!==t&&"true"===t.metadata["collection.in_collection"]}},e=async function(){for(;!Spicetify?.Player||!Spicetify?.Menu||!Spicetify?.Queue;)await new Promise(e=>setTimeout(e,100));const a=t(),r=function(e){null===localStorage.getItem("auto-skip:stats")&&localStorage.setItem("auto-skip:stats","{}");const t=JSON.parse(localStorage.getItem("auto-skip:stats")??"{}");return Object.keys(e).filter(e=>void 0===t[e]).forEach(e=>t[e]=0),localStorage.setItem("auto-skip:stats",JSON.stringify(t)),t}(u);let n=null,c={};async function i(){var t,a,i,s=Spicetify.Player?.data?.item;if(s){let e;null!==(e=null===n||n.uri!==s.uri?await l(s.uri):n)&&0<(a=m(e,s)).length&&(t=a.map(e=>u[e].menuTitle).join(", "),c=s?.uri===c?.uri&&s?.uid===c?.uid?(i=s?.metadata?.title+` was auto skipped due to ${t} filters.`,Spicetify.showNotification(i),console.log(i),{}):(a.forEach(e=>r[e]++),localStorage.setItem("auto-skip:stats",JSON.stringify(r)),(i=a.filter(e=>void 0!==u[e].callback)).length&&(document.querySelector(".main-nowPlayingBar-volumeBar > button")?.click(),await u[i[Math.floor(Math.random()*i.length)]].callback(e).then(e=>{n=e??n}).catch(e=>console.error(e)).finally(()=>{document.querySelector(".main-nowPlayingBar-volumeBar > button")?.click()})),a=Object.values(r).reduce((e,t)=>e+t,0),i=s?.metadata?.title+` skipped!Reasons: ${t}. Total skips = `+a,Spicetify.showNotification(i),console.log(i),Spicetify.Player.next(),s))}}function s(e,t){return new Spicetify.Menu.Item(e,a[t],e=>{a[t]=!a[t],e.isEnabled=a[t],e=a,o=e,localStorage.setItem("auto-skip:skips",JSON.stringify(o)),i()})}Spicetify.Player.addEventListener("songchange",i),Spicetify.Platform.PlayerAPI._events.addListener("queue_update",async function({data:e}){e.current&&(e.queued.length?n&&n?.uri===e?.queued[0]?.uri||e?.queued[0]?.uri&&(n=await l(e?.queued[0]?.uri)):n&&n?.uri===e?.nextUp[0]?.uri||e?.nextUp[0]?.uri&&(n=await l(e?.nextUp[0]?.uri)))}),i(),new Spicetify.Menu.SubMenu("Auto Skip",Object.entries(u).map(([e,t])=>s(t.menuTitle,e))).register()},(async()=>{await e()})();function t(){if(o)return o;try{var e=JSON.parse(localStorage.getItem("auto-skip:skips")??"{}");if(e&&"object"==typeof e)return o=e;throw""}catch{return localStorage.setItem("auto-skip:skips","{}"),o={}}}function a(e){var t=e.replace(/\(.+?\)/g,"").replace(/\[.+?\]/g,"").replace(/\s\-\s.+?$/,"").trim();return""==t?e:t}async function s(e){var e=await i.searchSpotify(e),t=await i.getTrackFeatures("?ids="+e.tracks.items.map(e=>e.uri.split(":")[2]).join()).catch(e=>console.error(e));for(const a of e.tracks.items)if(a.features=t.audio_features.filter(e=>e.uri===a.uri)[0],0==m(a).length)return console.log("Adding to queue",a),await i.addTrackToQueue(a.uri),a;return null}async function l(e){var e=e.split(":")[2],t=await i.getTrackDetails(e).catch(e=>console.error(e));return t&&t.name?(t.features=await i.getTrackFeatures(e).catch(e=>console.error(e)),t):null}function m(a,i=null){return Object.entries(t()).filter(([e,t])=>t&&u[e].check(a,i)).map(e=>e[0])}}();
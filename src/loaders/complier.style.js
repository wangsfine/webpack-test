function parseStyle(source) {
    return `
        (function(){
            var style = document.createElement('style'); 
            style.type = 'text/css'; 
            style.innerHTML=\`${source}\`; 
            document.getElementsByTagName('HEAD').item(0).appendChild(style); 
        })()
    `
}

module.exports = {
    parseStyle,
}
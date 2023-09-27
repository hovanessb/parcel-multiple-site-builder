const {Transformer} = require('@parcel/plugin');
const {partytownSnippet}  = require('@builder.io/partytown/integration')
const {minify}  = require('terser')

module.exports = new Transformer({
   async transform({asset}){
      let source = await asset.getCode();      
      const snippit = partytownSnippet();
      let mini = await minify(snippit);
      const script = "<script type='text/javascript'>" + mini.code + "</script>";
      source = source.replace("<head>", "<head>" + script );
      asset.setCode(source);
      return [asset];
   }
});
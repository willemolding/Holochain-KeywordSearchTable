

function createRecord(params) {
  // params has form {record: recordObj, keywords=[...]}
  var record = params.record;
  var keywords = params.keywords;

  var recordHash = commit('record', record);

  debug('record added at hash ' + recordHash);

  keywords.forEach(function (keyword) {
    var anchorHash = anchor('keyword', keyword);
    commit('recordKeywordLinks', {Links:[
        {Base: anchorHash, Link: recordHash, Tag: ''},
        {Base: recordHash, Link: anchorHash, Tag: ''}
    ]});
  });

  return true;
}


function findRecordsWithKeywords(params) {
  // params has form {keywords: [...]}
  var keywords = params.keywords;
  var resultHashes = [];

  keywords.forEach(function (keyword) {
    var anchorHash = anchor('keyword', keyword);
    var links = getLinks(anchorHash, '', {Load: false});

    links.forEach(function (linkTarget) {
      if (resultHashes.indexOf(linkTarget.Hash) < 0) { // only add to the list if not already there
        resultHashes.push(linkTarget.Hash);
      }
    });
  });

  return resultHashes.map(function (hash) {
    return get(hash);
  })
}


////////////////////////////////// Helper function for calling function from anchors zome

function anchor(anchorType, anchorText){
  return call('anchors', 'anchor', {anchorType: anchorType, anchorText: anchorText}).replace(/"/g, '');
}

function anchorExists(anchorType, anchorText){
  return call('anchors', 'exists', {anchorType: anchorType, anchorText: anchorText});
}

//////////////////////////////////// Required Callbacks


function genesis() {
  return true;
}

function validateCommit (entryName, entry, header, pkg, sources) {
  return true;
}

function validatePut (entryName, entry, header, pkg, sources) {
  return true;
}

function validateMod (entryName, entry, header, replaces, pkg, sources) {
  return true;
}

function validateDel (entryName, hash, pkg, sources) {
    return true;
}

function validateLink(linkEntryType,baseHash,links,pkg,sources) {
  return true;
}

function validatePutPkg (entryName) {
  return null;
}

function validateModPkg (entryName) {
  return null;
}

function validateDelPkg (entryName) {
  return null;
}

function validateLinkPkg (entryName) {
  return null;
}
var ms = require('./ms_text_analysis');
var profanity = require('profanity-util');

var fs = require('fs');
var path = require('path');


module.exports = {
  determine_name: determine_name,
  is_clean: is_clean,
  is_affirmative: is_affirmative
};

names = fs.readFileSync('./data/names.txt',{ encoding: 'utf8' });
names.split("\n")

/*
 * Determine's the name of the friend to contact.
 * msg: String message entered by the fbuser
 * callback: A user provided callback
 * Returns: A string which is human name identified
 *
 * Example:
 * res = determine_name("Ok, Jesus Christ what are you trying to say?", function(a) { console.log(a);});
 */
function determine_name(msg, callback) {
  function mycallback(error, response, data) {
    if(!error && response.statusCode ==200) {
      candidates = generate_two_grams(msg);
      for(var c in candidates) {
        names = c.split(" ")
        if( names[0][0] == names[0][0].toUpperCase()) { candidates[c] +=1; }; // First character capitalized
        if( names[1][0] == names[1][0].toUpperCase()) { candidates[c] +=1; }; // Second character capitalized
        if( names.indexOf(c[0].toLowerCase()) >= 0) { candidates[c] +=1; };
        if( names.indexOf(c[1].toLowerCase()) >= 0) { candidates[c] +=1; };
      }
      for( i=0; i<data.length; i++) {
        words = data[i].split(" ");
        if(words.length == 2 && (data in candidates)) {
          candidates[data] +=1;
        }
      }
      callback(max_candidate(candidates));
    }
  };

  function generate_two_grams(msg) {
    words = msg.split(" ");
    candidates = [];
    for(j = 0; j < (words.length - 1); j++) {
      candidates.push(words[j] + " " + words[j+1])
    }
    dict = {};
    for(c in candidates) {
      dict[candidates[c]] = 1
    }
    return dict;
  }

  function max_candidate(cans) {
    name = null
    score = -1;
    for( can in cans) {
      if(cans[can] > score) {
        name = can;
        score = cans[can];
      }
    }
    return name
  }

  ms.key_phrases(msg, mycallback);
}

function is_clean(msg) {
  res = profanity.check(msg);
  if(res.length != 0) {
    console.log(res);
    return false;
  } else {
    return true;
  }
}

function is_affirmative(msg) {
  affirmative_list = [
    "ok",
    "k",
    "kk",
    "okay",
    "yes",
    "affirmative",
    "amen",
    "fine",
    "good",
    "okay",
    "true",
    "sure",
    "yeah",
    "yea",
    "all right",
    "aye",
    "beyond a doubt",
    "by all means",
    "certainly",
    "definitely",
    "even so",
    "exactly",
    "gladly",
    "good enough",
    "granted",
    "indubitably",
    "just so",
    "most assuredly",
    "naturally",
    "of course",
    "positively",
    "precisely",
    "sure thing",
    "surely",
    "undoubtedly",,
    "unquestionably",
    "very well",
    "willingly",
    "without fail",
    "yep",
    "yup"]
    msg = msg.toLowerCase();
    if(affirmative_list.indexOf(msg) >=0) {
      return true
    } else {
      words = msg.split(" ")
      for(i=0; i< words.length; i++) {
        if(affirmative_list.indexOf(words[i]) >=0) {
          return true
        }
      }
    }
    return false
}

//determine_name("Harrison Pincket is a swell guy", function(a) { console.log(a);})

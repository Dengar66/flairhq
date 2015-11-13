var socket = require("socket.io-client");
var io = require("sails.io.js")(socket);
var referenceService = require('../../api/services/References.js');
var flairService = require('../../api/services/Flairs.js');

module.exports = {
  addRepeats: function ($scope) {
    var current_user = window.location.pathname.substring(0, 3) === '/u/' ? 'refUser' : 'user';
    $scope.editRef = function () {
      var url = "/reference/edit";
      $scope.editRefError = $scope.validateRef($scope.selectedRef);
      if ($scope.editRefError) {
        return;
      }
      $scope.indexSpin.editRef = true;
      io.socket.post(url, $scope.selectedRef, function (data, res) {
        $scope.indexSpin.editRef = false;
        if (res.statusCode === 200) {
          $scope.indexOk.editRef = true;
          var index = $scope.user.references.findIndex(function (searchRef) {
            return searchRef.id === $scope.selectedRef.id;
          });
          $scope.user.references[index] = $scope.selectedRef;
        } else {
          $scope.editRefError = "There was an issue.";
          console.log(res);
        }
        $scope.$apply();
      });
    };
    $scope.validateRef = function (ref) {
      var regexp = /(http(s?):\/\/)?(www|[a-z]*\.)?reddit\.com\/r\/((pokemontrades)|(SVExchange)|(poketradereferences))\/comments\/([a-z\d]*)\/([^\/]+)\/([a-z\d]+)(\?[a-z\d]+)?/,
        regexpGive = /(http(s?):\/\/)?(www|[a-z]*\.)?reddit\.com\/r\/((SVExchange)|(pokemontrades)|(poketradereferences)|(Pokemongiveaway)|(SVgiveaway))\/comments\/([a-z\d]*)\/([^\/]+)\/?/,
        regexpMisc = /(http(s?):\/\/)?(www|[a-z]*\.)?reddit\.com.*/,
        regexpUser = /^(\/u\/)?[A-Za-z0-9_\-]*$/,
        url = ref.url || ref.refUrl;
      if (!ref.type) {
        return "Please choose a type.";
      }
      if (ref.type === "egg" || ref.type === "giveaway" || ref.type === "misc" || ref.type === "eggcheck" || ref.type === "involvement") {
        if (!ref.descrip && !ref.description) {
          return "Make sure you enter all the information";
        }
      } else if (!ref.got || !ref.gave) {
        return "Make sure you enter all the information";
      }
      if (!url || ref.type !== "giveaway" && ref.type !== "misc" && ref.type !== "eggcheck" && !ref.user2) {
        return "Make sure you enter all the information";
      }
      if (((ref.type === "giveaway" || ref.type === "eggcheck") && !regexpGive.test(url)) ||
        (ref.type !== "giveaway" && ref.type !== "misc" && ref.type !== "eggcheck" && !regexp.test(url)) ||
        (ref.type === "misc" && !regexpMisc.test(url))) {
        return "Looks like you didn't input a proper permalink";
      }
      if (ref.user2.substring(0,3) === "/u/") {
        ref.user2 = ref.user2.slice(3);
      }
      if (ref.user2 === ($scope.user.name)) {
        return "Don't put your own username there.";
      }
      if (($scope.type !== "giveaway" && $scope.type !== "misc") && !regexpUser.test(ref.user2)) {
        return "Please put a username on its own, or in format: /u/username. Not the full url, or anything else.";
      }
      if (ref.number && isNaN(ref.number)) {
        return "Number must be a number.";
      }
      return "";
    };
    $scope.setLocalBan = function (username, ban) {
      var url = "/mod/setlocalban";
      io.socket.post(url, {username: username, ban: ban}, function (data, res) {
        if (res.statusCode === 200) {
          if ($scope.refUser) {
            $scope.refUser.banned = data.banned;
          } else {
            $scope.getBannedUsers();
          }
          $scope.$apply();
        } else {
          console.log("Error banning " + username + ": " + res.statusCode);
        }
      });
    };
    $scope.deleteRef = function (id) {
      var url = "/reference/delete";
      io.socket.post(url, {refId: id}, function (data, res) {
        if (res.statusCode === 200) {
          $scope[current_user].references = $scope[current_user].references.filter(function (ref) {
            return ref.id !== id;
          });
          $scope.$apply();
        } else {
          console.log(res.statusCode + ": " + data);
        }
      });
    };
    $scope.isNotNormalTrade = referenceService.isNotNormalTrade;
    $scope.hasNumber = referenceService.hasNumber;
    $scope.isEvent = referenceService.isEvent;
    $scope.isShiny = referenceService.isShiny;
    $scope.isCasual = referenceService.isCasual;
    $scope.isEggCheck = referenceService.isEggCheck;
    $scope.isTrade = referenceService.isTrade;
    $scope.isInvolvement = referenceService.isInvolvement;
    $scope.isEgg = referenceService.isEgg;
    $scope.isBank = referenceService.isBank;
    $scope.isGiveaway = referenceService.isGiveaway;
    $scope.isEggCheck = referenceService.isEggCheck;
    $scope.isMisc = referenceService.isMisc;
    $scope.isApproved = referenceService.isApproved;
    $scope.getRedditUser = referenceService.getRedditUser;
    $scope.formattedName = flairService.formattedName;
    $scope.inPokemonTradesTrader = flairService.inPokemonTradesTrader;
    $scope.inPokemonTradesHelper = flairService.inPokemonTradesHelper;
    $scope.inSVExchangeHatcher = flairService.inSVExchangeHatcher;
    $scope.inSVExchangeGiver = flairService.inSVExchangeGiver;
    $scope.getFlair = flairService.getFlair;
    $scope.userHasFlair = function (flair) {
      return flairService.userHasFlair($scope.user, flair);
    };
    $scope.numberOfTrades = function () {
      return referenceService.numberOfTrades($scope[current_user]);
    };
    $scope.numberOfPokemonGivenAway = function () {
      return referenceService.numberOfPokemonGivenAway($scope[current_user]);
    };
    $scope.numberOfEggsGivenAway = function () {
      return referenceService.numberOfEggsGivenAway($scope[current_user]);
    };
    $scope.numberOfEggChecks = function () {
      return referenceService.numberOfEggChecks($scope[current_user]);
    };
    $scope.numberOfApprovedEggChecks = function () {
      return referenceService.numberOfApprovedEggChecks($scope[current_user]);
    };
    $scope.getFlairTextForSVEx = function () {
      return flairService.getFlairTextForSVEx($scope[current_user]);
    };
    $scope.applied = function (flair) {
      return flairService.applied($scope.user, flair);
    };
    $scope.canUserApply = function (applicationFlair) {
      return flairService.canUserApply($scope.user, applicationFlair || $scope.selectedFlair, $scope.flairs);
    };
    $scope.formattedRequirements = function (flair) {
      return flairService.formattedRequirements(flair, $scope.flairs);
    };
  }
};
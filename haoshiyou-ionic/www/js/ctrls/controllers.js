'use strict';

var ctrls = angular.module('haoshiyou.controllers', ['ngResource', 'lbServices']);

function MainCtrl($rootScope, User, $scope) {
  $scope.logout = function() {
    console.log("Logout!");
    User.logout()
        .$promise
        .then(function () {
          $rootScope.session = null;
        })
        .catch(function (err) {
          console.log(err);
        });
  }
}
ctrls.controller('MainCtrl', MainCtrl);

function DashCtrl($scope, HaoshiyouService) {
  $scope.title = "Home";
  HaoshiyouService.postsP()
      .then(function(data) {
        $scope.posts = data;
      });
}
ctrls.controller('DashCtrl', DashCtrl);

function PostListCtrl($log, $scope, HsyPost, $ionicLoading, $ionicPopup,
                      $q, $state, SessionService, $ionicModal, ConstantService, $filter) {
  $scope.NEED_TYPE_COLOR = ConstantService.NEED_TYPE_COLOR;
  var filter = {
      limit: 10,
      order: 'startDate ASC',
      skip: 0,
      where: {}
  };
  $scope.needTypeFilter = {
      "招租": true,
      "求租": true,
      "找室友": true
  };
    $scope.getPostTitle = function(post) {
        var location = post.location + '附近';
        var startDate = "，起始时间：" + $filter('date')(post.startDate, "yyyy-MM-dd");
        var price = post.price ? "，价格：" + post.price : "" ;
        return location + startDate + price
    };
  var skip = 0;
  $scope.$state = $state;
  $scope.posts = [];
  $scope.canLoadMore = true;
  if ($state.is("tab.dash")) {
      $scope.title = "浏览帖子";
      $scope.canEdit = false;
  } else if ($state.is("tab.my")) {
      // TODO(zzn): Change session filter once we have id set up
      filter.where.createdBySessionId = SessionService.getSessionId();
      $scope.title = "我的帖子";
      $scope.canEdit = true;
  }
  $scope.viewOrEdit = function(postId) {
        $state.go($state.is('tab.my') ?
            "tab.edit" : "tab.view", {postId: postId});
    };
  $scope.delete = function(postId){
      var confirmPopup = $ionicPopup.confirm({
          title: '确认删除'
      });
      confirmPopup.then(function(res) {
          if(res) {
              console.log("postId=" + postId);
              HsyPost.findById({id: postId}).$promise.
                  then(function(hsyPost){
                      $log.info(hsyPost);
                      return $q.all([
                          hsyPost,
                          HsyPost.hsyHousePreference.destroy({id: postId}, housePreference),
                          HsyPost.hsyRoommatePreference.destroy({id: postId}, roommatePreference),
                      ]);
                  }).then(function(results){
                      var hsyPost = results[0];
                      $log.info(results);
                      return hsyPost.$delete();
                  }).then(function(){
                      $ionicLoading.show({ template: '已删除', noBackdrop: true, duration: 1500 });
                      $scope.reload(); // no chaining
                  })
                  .catch(function(err){
                      $log.error(err);
                      $ionicLoading.show({ template: '删除失败', noBackdrop: true, duration: 1500 });
                  });
          } else {
          }
      });
  };

  $scope.reload = function () {
    $scope.posts = []; // clean up
    return $scope.loadMore();
  };
  $scope.loadMore = function () {
      $log.info("loadMore triggered, current skip = " +  filter.skip);
      return HsyPost.find({ filter: filter})
      .$promise
      .then(function (results) {
          $log.info("Getting my posts:" + results.length);
          $log.info(results);
          $scope.posts = $scope.posts.concat(results);
          filter.skip = $scope.posts.length;
          if (results.length < filter.limit) $scope.canLoadMore = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');

      }).catch(function (err) {
          $log.error("Error getting my posts!");
          $log.error(JSON.stringify(err));
      });
  };
  $ionicModal.fromTemplateUrl('templates/filter.html', function(modal) {
      $scope.filterModal = modal;
  }, {
      scope: $scope
  });
  $scope.filterModelDone = function() {
      var needTypeList = [];
      for (var needType in $scope.needTypeFilter) {
          if ($scope.needTypeFilter[needType]) {
              needTypeList.push(needType);
          }
      }
      filter.where.needType = {inq: needTypeList};
      $scope.filterModal.hide();
      $scope.reload();
  };
}
ctrls.controller('PostListCtrl', PostListCtrl);

function LoginCtrl($scope, User, $rootScope) {
  $scope.data = {};

  $scope.login = function() {
    User.login({email: 'foo@bar.com', password: 'bar'})
        .$promise
        .then(function(session) {
          console.log(session);
          $rootScope.session = session;
        }).catch(function(err) {
          console.log(err);
        });
  };
  $scope.register = function() {
    User.create({email: 'foo@bar.com', password: 'bar'})
        .$promise.then(function(user) {
          console.log(user);
        }).catch(function(err) {
          console.log(err);
        });
  };
}
ctrls.controller('LoginCtrl', LoginCtrl);

function ViewPostCtrl($scope) {
  $scope.SHOW_COLUMNS_AND_ICONS = [
    ['qssj', 'ion-calendar'],
    ['ybhzcs', 'ion-location'],
    ['yqjg', 'ion-cash']
  ];
}
ctrls.controller('ViewPostCtrl', ViewPostCtrl);

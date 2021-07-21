currentModule.factory("exampleFactory", ($window) => () => {
  $window.alert("Xong roi");
});

currentModule.controller("quizController", [
  "$scope",
  "exampleFactory",
  function ($scope, exampleFactory) {
    $scope.name = "Thien";
    $scope.age = 21;

    $scope.handleClick = () => {
      exampleFactory();
    };
  },
]);

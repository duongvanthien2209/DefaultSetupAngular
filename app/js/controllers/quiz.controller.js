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

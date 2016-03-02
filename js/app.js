var app = angular.module('blog', []);
app.controller('myPlayerController',['$scope', myPlayerController]);


function myPlayerController($scope){

    function chekLength(streng){
        return streng
    };

    $scope.sound = 'Нема музики';
    $scope.player = document.getElementById('myaudio');
    var mySounds = [];
    $scope.playlist = [];
    var progress = document.getElementsByClassName('progress')[0];
    var volume = document.getElementsByClassName('volume')[0];
    $scope.musicProgress = 0;
    $scope.volumeProgress = 50;
    var indexCarentSong = 0;
    $scope.playListVisible = true;
    $scope.playlistShow = function (){
        $scope.playListVisible = !$scope.playListVisible;

    }

    $scope.nextSound = function (){
        try {
            if(indexCarentSong + 1 < $scope.playlist.length){
                indexCarentSong += 1;
            } else {
                indexCarentSong = 0;
            };
            $scope.selectSound($scope.playlist[indexCarentSong], indexCarentSong);
            //$scope.player.src = $scope.playlist[indexCarentSong].url;
        } catch (err) {
            console.info("no file in list" + err);
        };


    };

    $scope.preSound = function (){
        try {
            if (indexCarentSong - 1 > -1) {
                indexCarentSong -= 1;
            } else {
                indexCarentSong = $scope.playlist.length - 1;
            }
            ;
            $scope.selectSound($scope.playlist[indexCarentSong], indexCarentSong);
        } catch (err) {
            console.info("no file in list" + err);
        };
    };

    $scope.play = function(){
        console.log('play');
        $scope.player.play();
        console.log($scope.player.duration);
    };
    $scope.pause = function(){
        console.log('pause');
        $scope.player.pause();
    };

    $scope.selectSound = function (object, index){
        $scope.player.src = object.url;
        $scope.sound = object.soundName;
        indexCarentSong = index;
        $scope.player.volume = $scope.volumeProgress/100;
    }

    $scope.player.addEventListener("timeupdate", function(){
        $scope.musicProgress = 100 * Math.round($scope.player.currentTime) / Math.round( $scope.player.duration);
        if($scope.musicProgress >= 100){
            $scope.nextSound();
        };
        $scope.$digest();
    }, true);




    //add muving of song text
    volume.addEventListener("click", function(e) {
        if (!e) {
            e = window.event;
        }
        try {
            if(!$scope.player.duration){
                return;
            }
            $scope.volumeProgress = e.offsetX * 100 / volume.clientWidth;
            $scope.player.volume = $scope.volumeProgress/100;
            $scope.$digest();
        }
        catch (err) {
            if (window.console && console.error("Error:" + err));
        }
    }, true);


    progress.addEventListener("click", function(e) {
        if (!e) {
            e = window.event;}
        try {
            if(!$scope.player.duration){
                return;
            }
            $scope.player.currentTime = Math.round($scope.player.duration) * (e.offsetX / progress.clientWidth);
            $scope.$digest();
        }
        catch (err) {
            if (window.console && console.error("Error:" + err));
        }
    }, true);
    //----



    function modificatPlayList(){

        var myNextIndex = 0;
        function addToPlaylist(){
            if(mySounds.length == myNextIndex){
                $scope.$digest();
                return;
            }
            var reader = new FileReader();
            var file = mySounds[myNextIndex];
            reader.readAsDataURL(file);

            reader.onload = function () {
                var obj = {};
                //player.src = reader.result;
                obj.soundName = chekLength(file.name);
                obj.url = reader.result;
                obj.index = $scope.playlist.length + 1;
                $scope.playlist.push(obj);
                myNextIndex +=1;
                addToPlaylist();
            };
        };
        addToPlaylist();
    };



    var drg = function(e){
        e.stopPropagation();
        e.preventDefault();
    };
    var element = document.getElementsByClassName('footerOfPlayer')[0]; // узел, на который будем "сбрасывать" файлы

    element.addEventListener("dragenter", drg, false); // событие при наведении указателя
    element.addEventListener("dragover", drg, false); // событие при покидании мыши области элемента
    element.addEventListener("drop", function(e){ // непосредственно "сброс"
        if(!e.dataTransfer.files) return;
        e.stopPropagation();
        e.preventDefault();

        //e.dataTransfer.files // тот же список файлов, что и у инпута

        read(e.dataTransfer.files);
    }, false);

    function read(files){
        mySounds = [];
        for(var i = 0; i < files.length; i++){
            mySounds.push(files[i]);
        }
        modificatPlayList();
    };

    $scope.dropStart = function (){

    }


}



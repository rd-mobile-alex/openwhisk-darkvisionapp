//------------------------------------------------------------------------------
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------
(function () {
  function VideoController($location, VideosService, ImagesService, $stateParams, $state) {
    console.info("Initializing VideoController");
    var controller = this;

    controller.data = {
      video: {},
      images: [],
      summary: {}
    };

    controller.resizeFactor = function (image) {
      return 300 / controller.data.video.metadata.streams[0].width;
    };

    VideosService.get($stateParams.videoId).then(function (video) {
      controller.data.video = video;
    });

    VideosService.images($stateParams.videoId).then(function (images) {
      controller.data.images = images;
      controller.data.notProcessed = images.filter(image => image.analysis === null).length;
    });

    VideosService.summary($stateParams.videoId).then(function (summary) {
      controller.data.summary = summary;
    });

    controller.delete = function (image) {
      ImagesService.delete(image).then(function (result) {
        $("#entry-" + image._id).remove();
      });
    };

    controller.reset = function (targetImage) {
      if (targetImage) {
        ImagesService.reset(targetImage).then(function (targetImage) {
        });
      } else {
        VideosService.reset(controller.data.video._id).then(function (reset) {
          // reload the page, it will show empty
          $state.reload();
        });
      }
    };

    controller.resetImages = function() {
      VideosService.resetImages(controller.data.video._id).then(function (reset) {
        // reload the page, it will show empty
        $state.reload();
      });
    }
  }

  angular.module('app')
    .controller('VideoController', ['$location', 'VideosService', 'ImagesService', '$stateParams', '$state', VideoController]);
}());

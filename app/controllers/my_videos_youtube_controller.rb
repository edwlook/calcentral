class MyVideosYoutubeController < ApplicationController

  def get_videos
    if session[:user_id]
      render :json => MyVideosYoutube.new(:playlist_id => params[:playlist_id]).get_videos_as_json
    else
      render :json => {}.to_json
    end
  end

end

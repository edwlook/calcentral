class MyVideosController < ApplicationController

  def get_videos
    if session[:user_id]
      render :json => MyVideos.new(:ccns => params[:ccns]).get_videos_as_json
    else
      render :json => {}.to_json
    end
  end

end

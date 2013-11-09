class MyVideosController < ApplicationController

  def get_videos
    if session[:user_id]
      render :json => MyVideos.new(:year => params[:year], :semester => params[:semester], :ccn => params[:ccn]).get_videos_as_json
    else
      render :json => {}.to_json
    end
  end

end

require 'open-uri'
require 'json'

class MyVideos < MyMergedModel

  def initialize(options={})
    @playlist_title = options[:playlist_title] ? options[:playlist_title] : false
  end

  def get_videos_as_json
    id = get_playlist_id
    if !id
      return {}
    elsif id == 'error'
      return {
        :errorMessage => 'There was a problem fetching the videos.'
      }
    end
    get_youtube_videos(id)
  end

  def get_playlist_id
    if @playlist_title
      MyPlaylists.new(:playlist_title => @playlist_title).get_playlists_as_json
    end
  end

  def get_youtube_videos(id)
    MyYoutube.new(:playlist_id => id).get_videos_as_json
  end


end

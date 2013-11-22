require 'open-uri'
require 'json'

class MyVideosYoutube < MyMergedModel
  attr_reader :my_videos
  def initialize(options={})
    @base_url = options[:base_url] ||= 'http://gdata.youtube.com/feeds/api/playlists/'
    @playlist_id = options[:playlist_id] ? options[:playlist_id] : false
    @my_videos = {
      :videos => []
    }
  end

  def get_videos_as_json
    request_url = build_url()
    response = request(request_url)
    if !response
      return @my_videos
    end
    data = JSON.parse(response.read)
    # if data['search-results']['total'] == '0'
    #   next
    # else
    #   results = data['search-results']['result']
    #   filter_videos(results)
    # end
    filter_videos(data)
    @my_videos
  end

  def build_url()
    request_url = @base_url + @playlist_id + '?max-results=2&start-index=1&alt=json'
  end

  def request(url)
    begin
      response = open(url)
    rescue => error
      puts "An error occured while requesting #{url}"
      puts error
      return false
    end
    return response
  end

  # Find the videos we want and push them to @my_videos[:videos] as an object
  def filter_videos(data)
    entries = data['feed']['entry']
    entries.each do |entry|
      title = entry['media$group']['media$title']['$t']
      link = entry['media$group']['media$content'][0]['url']
      @my_videos[:videos].push({
        :title => title,
        :link => link
      })
    end
  end

  def get_video_url(tracks)
    tracks.each do |track|
      if track['mimetype'] === 'video/mp4'
        return track['url']
      end
    end
  end

  # Get a screenshot for each video
  # This is the image that shows before a user clicks play
  def get_poster(attachments)
    attachments.each do |attachment|
      if attachment['mimetype'] === 'image/jpeg'
        return attachment['url']
      end
    end
  end

end

require 'open-uri'
require 'json'

class MyYoutube < MyMergedModel
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
    filter_videos(data)
    @my_videos
  end

  def build_url()
    request_url = @base_url + @playlist_id + '?alt=json'
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

  def filter_videos(data)
    entries = data['feed']['entry']
    entries.each do |entry|
      title = entry['media$group']['media$title']['$t']
      link = entry['media$group']['media$content'][0]['url']
      @my_videos[:videos].push({
        :title => title,
        :link => link.gsub('/v/', '/embed/')
      })
    end
  end

end

require 'json'

class MyYoutube < MyMergedModel

  def initialize(options={})
    @base_url = options[:base_url] ||= 'http://gdata.youtube.com/feeds/api/playlists/'
    @playlist_id = options[:playlist_id] ? options[:playlist_id] : false
    @my_videos = {
      :videos => []
    }
  end

  def get_videos_as_json
    request_url = build_url
    response = request(request_url)
    if !response
      return @my_videos
    end
    data = JSON.parse(response[:body])
    filter_videos(data)
    @my_videos
  end

  def build_url()
    request_url = @base_url + @playlist_id
  end

  def request(url)
    proxy = VideosProxy.new({
      :url => url,
      :vcr_name => 'Youtube',
      :params => {
        :alt => 'json'
      }
    })
    proxy_response = proxy.get
  end

  def filter_videos(data)
    entries = data['feed']['entry']
    entries.each do |entry|
      title = entry['media$group']['media$title']['$t']
      url = entry['media$group']['media$content'][0]['url']
      url.gsub!('/v/', '/embed/')
      link = url + '&showinfo=0&theme=light&modestbranding=1'
      @my_videos[:videos].push({
        :title => title,
        :link => link
      })
    end
  end

end

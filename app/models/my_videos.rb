require 'open-uri'
require 'json'

class MyVideos < MyMergedModel
  attr_reader :my_videos
  def initialize(options={})
    @base_url = options[:base_url] ||= 'http://playback-qa.ets.berkeley.edu/search/paellaEpisodeListing.json?q=&sid='
    @year = options[:year]
    @semester = options[:semester]
    @ccn = options[:ccn]
    @my_videos = {
      :videos => []
    }
  end

  def get_videos_as_json
    request_url = build_url()
    response = request(request_url)
    # If request fails, return with nothing
    if !response
      return @my_videos
    end
    data = JSON.parse(response.read)
    # If results are empty, return with nothing
    if data['search-results']['total'] == '0'
      @my_videos
    else
      results = data['search-results']['result']
      filter_videos(results)
      @my_videos
    end
  end

  def build_url
    request_url = @base_url + @year + @semester + @ccn
    request_url
  end

  def request(url)
    begin
      response = open(url)
    rescue
      puts "An error occured while requesting #{url}"
      return false
    end
    return response
  end

  # Find the videos we want and push them to @my_videos[:videos] as an object
  def filter_videos(results)
    paella_base_url = 'http://playback-qa.ets.berkeley.edu/paella/ui/watch.html?server=&id='
    results.each do |result|
      id = result['id']
      paella = paella_base_url + id
      title = result['mediapackage']['title']
      attachments = result['mediapackage']['attachments']['attachment']
      tracks = result['mediapackage']['media']['track']
      @my_videos[:videos].push({
        :title => title,
        :link => get_video_url(tracks),
        :paella => paella,
        :poster => get_poster(attachments)
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

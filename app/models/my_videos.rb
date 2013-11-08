require 'open-uri'
require 'json'

class MyVideos < MyMergedModel

  def initialize(year, semester, ccn)
    @year = year
    @semester = semester
    @ccn = ccn
    @my_videos = {
      :videos => []
    }
  end

  def get_videos_as_json
    request_url = build_url()
    response = JSON.parse(open(request_url).read)
    results = response['search-results']['result']
    filter_videos(results)
    @my_videos
  end

  def build_url
    base_url = 'http://playback-qa.ets.berkeley.edu/search/paellaEpisodeListing.json?q=&sid='
    request_url = base_url + @year + @semester + @ccn
    request_url
  end

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

  def get_poster(attachments)
    attachments.each do |attachment|
      if attachment['mimetype'] === 'image/jpeg'
        return attachment['url']
      end
    end
  end

end

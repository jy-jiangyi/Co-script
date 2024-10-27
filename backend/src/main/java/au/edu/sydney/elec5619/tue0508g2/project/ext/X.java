package au.edu.sydney.elec5619.tue0508g2.project.ext;

import au.edu.sydney.elec5619.tue0508g2.project.config.XConfig;
import io.github.redouane59.twitter.TwitterClient;
import io.github.redouane59.twitter.signature.TwitterCredentials;
import org.springframework.stereotype.Service;

@Service
public class X {

    private final XConfig xconfig;
    TwitterClient client;

    public X(XConfig xconfig) {
        this.xconfig = xconfig;
        client = new TwitterClient(
                TwitterCredentials.builder()
                        .bearerToken(xconfig.getBear())
                        .accessToken(xconfig.getAcctok())
                        .accessTokenSecret(xconfig.getAccsec())
                        .apiKey(xconfig.getApikey())
                        .apiSecretKey(xconfig.getApisec())
                        .build()
        );
    }

    public void tweet(String content) {
        client.postTweet(content);
    }

}

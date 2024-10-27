package au.edu.sydney.elec5619.tue0508g2.project.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties("ext.x")
public class XConfig {

    private String apikey;

    private String apisec;

    private String acctok;

    private String accsec;

    private String bear;

}

/*
ext.x.api_key=$(API_KEY)
ext.x.api_sec=$(API_SEC)
ext.x.acc_tok=$(ACC_TOK)
ext.x.acc_sec=$(ACC_SEC)

 */
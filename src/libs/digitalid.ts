import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface DigitalIDProfile {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  hd: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}

export default function DigitalID<
  P extends Record<string, any> = DigitalIDProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  // console.log('[DIGITAL_ID] options:', typeof options, options);
  return {
    id: 'digitalid',
    name: 'Digital ID',
    type: 'oauth',
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    authorization: {
      params: { scope: 'openid require_email name preferred_username' },
    },
    idToken: true,
    checks: ['pkce', 'state'],
    userinfo: {
      // The result of this method will be the input to the `profile` callback.
      async request(context) {
        // context contains useful properties to help you make the request.
        const { provider, tokens } = context;
        const wellKnown = await getWellKnown(provider.wellKnown);
        return getUserInfo(wellKnown, tokens.access_token);
      },
    },
    profile: async (profile) => {
      // const user = await
      // console.log('[DIGITAL_ID] this:', );
      // console.log('[DIGITAL_ID] profile:', typeof profile, profile);
      return {
        id: profile.sub,
        name: profile.name,
        username: profile.preferred_username ?? profile.name,
        email: profile.require_email,
        image: null,
      };
    },
    options,
  };
}

async function getWellKnown(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function getUserInfo(wellKnown, accessToken) {
  // NOTE: Digital ID doesn't bundle basicUserInfo with callback; so we need to get that manually.
  // NOTE: doc @https://kb.dga.or.th/s/bkcnd3p5f5r4kv7eibfg/digital-id/d/c3851d95f5r8tlpockr0/digital-id-open-id-connect
  const res = await fetch(wellKnown.userinfo_endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  // console.log('[DIGITAL_ID] getUserInfo: ', data);
  return data;
}

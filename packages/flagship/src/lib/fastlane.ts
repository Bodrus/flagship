import { Config } from '../types';
import * as fs from './fs';
import { logInfo, logWarn } from '../helpers';

/**
 * Configures the project Fastfile from the project configuration.
 *
 * @param {string} path The path to the project Fastfile
 * @param {object} configuration The project configuration.
 */
// tslint:disable-next-line: cyclomatic-complexity
export function configure(path: string, configuration: Config): void {
  const buildConfig = configuration && configuration.buildConfig && configuration.buildConfig.ios;

  logInfo(`updating fastfile at ${path}`);

  if (buildConfig) {
    if (buildConfig.exportMethod) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_export_method/g,
        `export_method: "${buildConfig.exportMethod}", #PROJECT_MODIFY_FLAG_export_method`
      );
    }

    if (buildConfig.exportTeamId) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_export_team_id/g,
        `export_team_id: "${buildConfig.exportTeamId}", #PROJECT_MODIFY_FLAG_export_team_id`
      );
    }

    if (buildConfig.provisioningProfileName) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_export_options_provisioning_profile/g,
        // tslint:disable-next-line:ter-max-len
        `"${buildConfig.provisioningProfileName}" #PROJECT_MODIFY_FLAG_export_options_provisioning_profile`
      );

      if (buildConfig.exportTeamId) {
        fs.update(
          path,
          /.+#PROJECT_MODIFY_FLAG_xcargs/g,
          'xcargs: "' + [
            `DEVELOPMENT_TEAM='${buildConfig.exportTeamId}'`,
            `PROVISIONING_PROFILE_SPECIFIER='${buildConfig.provisioningProfileName}'`
          ].join(' ') + '" #PROJECT_MODIFY_FLAG_export_team_id'
        );
      }
    }
  }

  // Inject the Hockey API token
  if (process.env.HOCKEYAPP_API_TOKEN) {
    fs.update(
      path,
      /.+#PROJECT_MODIFY_FLAG_hockey_api_token/g,
      `api_token: "${process.env.HOCKEYAPP_API_TOKEN}" #PROJECT_MODIFY_FLAG_hockey_api_token`
    );

    logInfo('updated Hockey API token from process ENV [HOCKEYAPP_API_TOKEN]');
  }

  // Inject App Center configurations
  if (configuration && configuration.appCenter) {
    const { apiToken, organization, distribute } = configuration.appCenter;

    if (apiToken) {
      logWarn(
        'appCenter.apiToken is deprecated and will be removed in a future release;'
        + ' use APPCENTER_API_TOKEN environment variable instead'
      );

      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_appcenter_api_token/g,
        `api_token: "${apiToken}", #PROJECT_MODIFY_FLAG_appcenter_api_token`
      );
    }

    fs.update(
      path,
      /.+#PROJECT_MODIFY_FLAG_appcenter_owner_name/g,
      `owner_name: "${organization}", #PROJECT_MODIFY_FLAG_appcenter_owner_name`
    );

    if (distribute && distribute.appNameIOS) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_appcenter_app_name_ios/g,
        `app_name: "${distribute.appNameIOS}" #PROJECT_MODIFY_FLAG_appcenter_app_name_ios`
      );
    }

    if (distribute && distribute.appNameAndroid) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_appcenter_app_name_android/g,
        `app_name: "${distribute.appNameAndroid}" #PROJECT_MODIFY_FLAG_appcenter_app_name_android`
      );
    }
  }
}

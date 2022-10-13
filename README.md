# !!! Archival Notice !!!

The functionality of this GitHub action is already part of Modrinth itself. See RubixDev/modrinth-auto-feature#1 for more information.

## Modrinth Auto Feature action

A GitHub Action to automatically feature the most relevant mod versions on Modrinth.

This action takes a Modrinth project ID and an API token, and automatically sets the most recent mod version per Minecraft version to featured and every older version to non-featured.

## Inputs

| Name         | Required | Description                                                                                                                                                                                    |
|--------------|:--------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `token`      | ✅       | The API token for authorization. You can create one [here](https://github.com/settings/tokens/new?description=Modrinth%20API%20Token) (no scopes necessary). Use a repository secret for this. |
| `project_id` | ✅       | Project ID of the project to edit. You can get the ID from the sidebar on a project page under "Technical Information".                                                                        |
| `staging`    | ❌       | Whether to use Modrinth's staging API.                                                                                                                                                         |

## Outputs
This action has no outputs.

## Example usage
```yml
uses: RubixDev/modrinth-auto-feature@v1
with:
  token: ${{ secrets.MODRINTH_TOKEN }}
  project_id: vUi6HFie
```

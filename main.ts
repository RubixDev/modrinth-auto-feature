import { getInput, setFailed } from '@actions/core'
import fetch from 'node-fetch'

const API_URL = 'https://api.modrinth.com/v2'
const STAGING_API_URL = 'https://staging-api.modrinth.com/v2'

main().catch(e => setFailed(e.message))

interface Version {
    name: string
    version_number: string
    changelog: string | null
    dependencies: Dependency[] | null
    game_versions: string[]
    version_type: 'alpha' | 'beta' | 'release'
    loaders: string[]
    featured: boolean
    id: string
    project_id: string
    author_id: string
    date_published: string
    downloads: number
    changelog_url: string | null
    files: File[]
}

interface Dependency {
    version_id: string | null
    project_id: string | null
    file_name: string | null
    dependency_type: 'required' | 'optional' | 'incompatible' | 'embedded'
}

interface File {
    hashes: {
        sha512: string
        sha1: string
    }
    url: string
    filename: string
    primary: boolean
    size: number
}

async function main() {
    const token = getInput('token', { required: true })
    const projectId = getInput('project_id', { required: true })
    const staging =
        (getInput('staging', { required: false }) || 'false').toLowerCase() ===
        'true'

    const apiUrl = staging ? STAGING_API_URL : API_URL

    const versionsResponse = await fetch(
        `${apiUrl}/project/${projectId}/version`,
    )
    if (versionsResponse.status !== 200) {
        setFailed(`Failed to get versions of project with id ${projectId}`)
        return
    }
    const versions = (await versionsResponse.json()) as Version[]
    const allGameVersions = [
        ...new Set(
            ([] as string[]).concat(...versions.map(v => v.game_versions)),
        ),
    ]

    const shouldBeFeatured: Version[] = []
    for (const gameVersion of allGameVersions) {
        const newest = versions
            .filter(v => v.game_versions.includes(gameVersion))
            .reduce((prev, current) =>
                Date.parse(prev.date_published) >
                Date.parse(current.date_published)
                    ? prev
                    : current,
            )
        if (!shouldBeFeatured.includes(newest)) shouldBeFeatured.push(newest)
    }

    for (const version of versions) {
        let featured = null
        if (shouldBeFeatured.includes(version) && !version.featured)
            featured = true
        if (!shouldBeFeatured.includes(version) && version.featured)
            featured = false
        if (featured === null) continue
        await fetch(`${apiUrl}/version/${version.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'github.com/RubixDev/modrinth-auto-feature',
                Authorization: token,
            },
            body: JSON.stringify({
                featured,
            }),
        })
    }
}
